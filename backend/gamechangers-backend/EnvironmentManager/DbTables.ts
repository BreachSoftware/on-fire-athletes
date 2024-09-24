
// This file is auto-generated. Do not edit it manually.

/**
 * Array of all available DynamoDB table names.
 * These are automatically generated from the serverless.yml file.
 */
export const DB_TABLES = [
	"GamechangersCards",
	"GamechangersUsers",
	"GamechangersOrders",
	"GamechangersSerialCards"
] as const;

/**
 * Type representing valid database table names.
 * This type is automatically updated when new tables are added to DB_TABLES.
 */
export type DbTable = typeof DB_TABLES[number];
