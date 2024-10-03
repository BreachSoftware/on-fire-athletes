import { S3 } from "aws-sdk";

/**
 * This function renames an object in an S3 bucket.
 * Used when a user cretes an account and we need to rename the object to the user's ID.
 *
 * @param bucketName: string - the name of the S3 bucket
 * @param oldKeyName: string - the url of the object to be renamed ex. "image/1235647485.jpg"
 * @param userID: string - the userId that the object could belong
 */
export async function renameS3Object(
	bucketName: string,
	oldKeyName: string,
	userID: string,
): Promise<string> {
	try {
		const s3 = new S3();

		const folder = oldKeyName.split("/")[0];
		const timestamp = Math.floor(Date.now() / 1000).toString();
		const extention = oldKeyName.split(".")[1];

		const newKeyName = `${folder}/${userID}-${timestamp}.${extention}`;

		// Copy the object to the new key
		await s3
			.copyObject({
				Bucket: bucketName,
				CopySource: `/${bucketName}/${oldKeyName}`,
				Key: newKeyName,
			})
			.promise();

		// Delete the old object
		await s3
			.deleteObject({
				Bucket: bucketName,
				Key: oldKeyName,
			})
			.promise();

		console.log(`Successfully renamed ${oldKeyName} to ${userID}`);

		// it done succeeded
		return newKeyName;
	} catch (error) {
		if ((error as { code: string }).code === "NoSuchKey") {
			console.log("Error renaming S3 object: No such objct found");
		} else {
			console.error("Error renaming S3 object:", error);
		}

		// it failed
		return "";
	}
}
