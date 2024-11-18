import {
	AdminCreateUserCommand,
	AdminCreateUserCommandInput,
	CognitoIdentityProviderClient,
	UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDB } from "aws-sdk";

migrateAuth();

interface MigrationResult {
	success: boolean;
	email: string;
	error?: string;
	temporaryPassword?: string;
	status: "created" | "duplicate" | "error";
}

async function migrateAuth() {
	const userPoolId = "us-east-1_Awb6vGmOg";
	const region = "us-east-1";

	const cognitoClient = new CognitoIdentityProviderClient({
		region,
		credentials: {
			accessKeyId: "AKIA6GSNGQDIPRMW4B77",
			secretAccessKey: "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",
		},
	});

	// Create an instance of the DynamoDB DocumentClient
	const dynamoDb = new DynamoDB.DocumentClient({
		region,
		credentials: {
			accessKeyId: "AKIA6GSNGQDIPRMW4B77",
			secretAccessKey: "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",
		},
	});

	const results: MigrationResult[] = [];

	try {
		const userTable = "GamechangersUsers";

		// Retrieve the card item from the DynamoDB table
		const allUsers = await dynamoDb
			.scan({
				TableName: userTable,
				AttributesToGet: ["email"],
			})
			.promise();

		if (!allUsers.Items || allUsers.Items.length === 0) {
			console.log("No user items found");
			return;
		}

		const usersWithEmail = allUsers.Items.filter((user) => user.email) as {
			email: string;
		}[];

		for (const user of usersWithEmail) {
			try {
				const temporaryPassword = "Password123!";

				const createUserParams: AdminCreateUserCommandInput = {
					UserPoolId: userPoolId,
					Username: user.email,
					TemporaryPassword: temporaryPassword,
					MessageAction: "SUPPRESS",
					UserAttributes: [
						{
							Name: "email",
							Value: user.email,
						},
						{
							Name: "email_verified",
							Value: "true",
						},
					],
				};

				await cognitoClient.send(
					new AdminCreateUserCommand(createUserParams),
				);
			} catch (error) {
				if (error instanceof UsernameExistsException) {
					results.push({
						success: false,
						email: user.email,
						error: "User already exists in Cognito",
						status: "duplicate",
					});

					console.log(`Skipping duplicate user ${user.email}`);
				} else {
					results.push({
						success: false,
						email: user.email,
						error:
							error instanceof Error
								? error.message
								: "Unknown error",
						status: "error",
					});

					console.error(
						`Failed to create user ${user.email}:`,
						error,
					);
				}
			}
		}
	} catch (error) {
		console.error("Failed to migrate auth:", error);
	}
}
