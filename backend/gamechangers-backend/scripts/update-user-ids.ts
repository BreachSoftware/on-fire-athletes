import {
	AttributeType,
	CognitoIdentityProviderClient,
	ListUsersCommand,
	ListUsersCommandInput,
	ListUsersResponse,
	UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDB } from "aws-sdk";

updateUserIds();

async function updateUserIds() {
	const idsToInclude: string[] = [
		// {
		// 	oldId: "31ad0988-19c4-4f29-8d47-a2a3861758bf",
		// 	newId: "44184428-f0d1-70c9-383f-78c94551fd35",
		// },
		// {
		// 	oldId: "2bd87e66-bd1e-4ecf-aac8-c020b95d6f0a",
		// 	newId: "0488b4b8-9021-70ec-67aa-d66c83dd1354",
		// },
		// {
		// 	oldId: "224a8dee-29b3-4c03-b327-9ed385b5ff3b",
		// 	newId: "7458e448-8081-70cd-6361-543ae1b48b0c",
		// },
	];

	const region = "us-east-1";
	const accessKeyId = "AKIA6GSNGQDIPRMW4B77";
	const secretAccessKey = "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";
	const userPoolId = "us-east-1_Awb6vGmOg";

	// Create an instance of the DynamoDB DocumentClient
	const dynamoDb = new DynamoDB.DocumentClient({
		region,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});

	const dbUsers = await dynamoDb
		.scan({
			TableName: "GamechangersUsers",
			AttributesToGet: ["uuid", "email"],
		})
		.promise();

	const authUsers = await listCognitoUsers({
		region,
		accessKeyId,
		secretAccessKey,
		userPoolId,
	});

	const differingIdsMap: Record<string, string> = {};

	console.log("dbUsers:", JSON.stringify(dbUsers.Items?.slice(7, 10)));
	console.log("authUsers:", JSON.stringify(authUsers.slice(0, 3)));

	console.log(
		`Got ${dbUsers.Items?.length} DB users and ${authUsers.length} auth users`,
	);

	dbUsers.Items?.forEach((dbUser) => {
		console.log("dbUser:", dbUser);

		const email = dbUser.email;
		const authUser = authUsers.find((user) => user.email === email);

		if (!authUser) {
			console.log(`No auth user found for email ${email}`);
		}

		if (authUser && authUser.username !== dbUser.uuid) {
			differingIdsMap[dbUser.uuid] = authUser.username;
		}
	});

	console.log(
		`Got ${Object.entries(differingIdsMap).length} differing user IDs:`,
		differingIdsMap,
	);

	// for (const { oldId, newId } of idsToInclude) {
	// 	differingIdsMap[oldId] = newId;
	// }

	for (const [oldId, newId] of Object.entries(differingIdsMap)) {
		console.log(`Updating user ${oldId} to ${newId}`);

		// Can't update primary key, so delete and re-create the user
		// Update users table - Create new record then delete old
		const userRecord = await dynamoDb
			.get({
				TableName: "GamechangersUsers",
				Key: { uuid: oldId },
			})
			.promise();

		if (userRecord.Item) {
			const newUserRecord = { ...userRecord.Item, uuid: newId };
			await dynamoDb
				.put({
					TableName: "GamechangersUsers",
					Item: newUserRecord,
				})
				.promise();

			await dynamoDb
				.delete({
					TableName: "GamechangersUsers",
					Key: { uuid: oldId },
				})
				.promise();
		}

		// Update related records in other tables
		const tablesToUpdate = [
			{
				table: "GamechangersSerialCards",
				fields: ["generatedBy", "#owner"],
				updateKeys: ["uuid", "serialNumber"],
			},
			{
				table: "GamechangersOrders",
				fields: ["card_generatedBy", "sender_uuid", "receiver_uuid"],
				updateKeys: ["uuid", "card_uuid"],
			},
		];

		for (const { table, fields, updateKeys } of tablesToUpdate) {
			for (const field of fields) {
				try {
					// Query for items with the old ID
					const items = await dynamoDb
						.scan({
							TableName: table,
							FilterExpression: `${field} = :oldId`,
							ExpressionAttributeValues: { ":oldId": oldId },
							...(field === "#owner" && {
								ExpressionAttributeNames: {
									"#owner": "owner",
								},
							}),
						})
						.promise();

					// Update each item with the new ID
					for (const item of items.Items ?? []) {
						const keyForUpdate = updateKeys.reduce(
							(acc, key) => {
								acc[key] = item[key];
								return acc;
							},
							{} as Record<string, string>,
						);

						await dynamoDb
							.update({
								TableName: table,
								Key: keyForUpdate,
								UpdateExpression: `set ${field} = :newId`,
								ExpressionAttributeValues: { ":newId": newId },
								...(field === "#owner" && {
									ExpressionAttributeNames: {
										"#owner": "owner",
									},
								}),
							})
							.promise();
					}

					console.log(
						`Updated ${items.Items?.length ?? 0} items in ${table} for field ${field}`,
					);
				} catch (error) {
					console.error(
						`Error updating ${field} in ${table}:`,
						error,
					);

					throw error;
				}
			}
		}

		const tablesWithKeysToUpdate = [
			{
				table: "GamechangersCards",
				fields: ["generatedBy"],
				updateKeys: ["generatedBy", "uuid"],
			},
		];

		// These tables need to delete the old record and create a new one, similar to users above
		for (const { table, fields, updateKeys } of tablesWithKeysToUpdate) {
			for (const field of fields) {
				try {
					// Query for items with the old ID
					const items = await dynamoDb
						.scan({
							TableName: table,
							FilterExpression: `${field} = :oldId`,
							ExpressionAttributeValues: { ":oldId": oldId },
						})
						.promise();

					// Update each item with the new ID
					for (const item of items.Items ?? []) {
						const keyForUpdate = updateKeys.reduce(
							(acc, key) => {
								acc[key] = item[key];
								return acc;
							},
							{} as Record<string, string>,
						);

						await dynamoDb
							.put({
								TableName: table,
								Item: { ...item, [field]: newId },
							})
							.promise();

						await dynamoDb
							.delete({
								TableName: table,
								Key: keyForUpdate,
							})
							.promise();
					}

					console.log(
						`Updated ${items.Items?.length ?? 0} items in ${table} for field ${field}`,
					);
				} catch (error) {
					console.error(
						`Error updating ${field} in ${table}:`,
						error,
					);

					throw error;
				}
			}
		}
	}
}

async function listCognitoUsers({
	region,
	accessKeyId,
	secretAccessKey,
	userPoolId,
}: {
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
	userPoolId: string;
}): Promise<CognitoUser[]> {
	const cognitoClient = new CognitoIdentityProviderClient({
		region,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});

	const users: CognitoUser[] = [];
	let paginationToken: string | undefined;

	try {
		do {
			const params: ListUsersCommandInput = {
				UserPoolId: userPoolId,
				Limit: 60, // Max number of users per request
				PaginationToken: paginationToken,
			};

			const response: ListUsersResponse = await cognitoClient.send(
				new ListUsersCommand(params),
			);

			if (response.Users) {
				const formattedUsers = response.Users.map((user: UserType) => ({
					username: user.Username!,
					enabled: user.Enabled ?? false,
					status: user.UserStatus!,
					email: user.Attributes?.find(
						(attr) => attr.Name === "email",
					)?.Value,
					givenName: user.Attributes?.find(
						(attr) => attr.Name === "given_name",
					)?.Value,
					familyName: user.Attributes?.find(
						(attr) => attr.Name === "family_name",
					)?.Value,
					createdAt: user.UserCreateDate,
					lastModifiedAt: user.UserLastModifiedDate,
					attributes: user.Attributes ?? [],
				}));

				users.push(...formattedUsers);
			}

			paginationToken = response.PaginationToken;

			// Optional: Log progress for large user pools
			console.log(`Retrieved ${users.length} auth users so far...`);
		} while (paginationToken);

		console.log(`Successfully retrieved ${users.length} total auth users`);

		return users;
	} catch (error) {
		console.error("Error listing Cognito users:", error);
		throw error;
	}
}

interface CognitoUser {
	username: string;
	enabled: boolean;
	status: string;
	email?: string;
	givenName?: string;
	familyName?: string;
	createdAt?: Date;
	lastModifiedAt?: Date;
	attributes: AttributeType[];
}
