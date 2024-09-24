/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-sync */

import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

/**
 * This script dynamically generates TypeScript files (ApiEndpoints.ts and DbTables.ts) that export the available API endpoints and DynamoDB tables.
 * These are automatically extracted from the serverless.yml file every time we deploy the backend.
 */

/**
 * Converts a path string by replacing slashes with underscores.
 * @param pathStr The path string to convert.
 * @returns The underscore-separated string.
 */
function pathToUnderscore(pathStr: string): string {
	return pathStr.split("/").filter(Boolean).join("_");
}

// Read the serverless.yml file
const serverlessYml = yaml.load(fs.readFileSync(path.resolve(__dirname, "../serverless.yml"), "utf8")) as any;

// Extract the function names and paths, which will be our API endpoints
const functions = serverlessYml.functions || {};
const endpoints = Object.entries(functions).reduce((acc, [ , funcDef ]: [string, any]) => {
	if (funcDef.events) {
		for (const event of funcDef.events) {
			if (event.httpApi && event.httpApi.path) {
				const underscorePath = pathToUnderscore(event.httpApi.path);
				acc.push(underscorePath);
				break; // Assuming one HTTP event per function
			}
		}
	}
	return acc;
}, [] as string[]);

// Generate the content for ApiEndpoints.ts
const apiEndpointsContent = `
// This file is auto-generated. Do not edit it manually.

/**
 * Array of all available API endpoints.
 * These are automatically generated from the serverless.yml file.
 * Nested paths are converted by replacing slashes with underscores.
 */
export const API_ENDPOINTS = ${JSON.stringify(endpoints, null, "\t")} as const;

/**
 * Type representing valid API endpoints.
 * This type is automatically updated when new endpoints are added to API_ENDPOINTS.
 */
export type ApiEndpoint = typeof API_ENDPOINTS[number];
`;

// Write the content to ApiEndpoints.ts
fs.writeFileSync(path.resolve(__dirname, "ApiEndpoints.ts"), apiEndpointsContent);

console.log("ApiEndpoints.ts has been updated successfully.");

// Extract the table names from the IAM role statements
const tables = new Set<string>();
(serverlessYml.provider.iam.role.statements || []).forEach((statement: any) => {
	if (statement.Resource) {
		const resources = Array.isArray(statement.Resource) ? statement.Resource : [ statement.Resource ];
		resources.forEach((resource: string) => {
			const tableNameMatch = resource.match(/table\/([^\/]*)/);
			if (tableNameMatch) {
				tables.add(tableNameMatch[1]);
			}
		});
	}
});

// Convert Set to Array and remove duplicates that differ only by the "Development-" prefix
const tableArray = Array.from(tables);
const uniqueTables = new Set<string>();
tableArray.forEach((table) => {
	const strippedTable = table.replace(/^Development-/, "");
	uniqueTables.add(strippedTable);
});

// Generate the content for DbTables.ts
const dbTablesContent = `
// This file is auto-generated. Do not edit it manually.

/**
 * Array of all available DynamoDB table names.
 * These are automatically generated from the serverless.yml file.
 */
export const DB_TABLES = ${JSON.stringify(Array.from(uniqueTables), null, "\t")} as const;

/**
 * Type representing valid database table names.
 * This type is automatically updated when new tables are added to DB_TABLES.
 */
export type DbTable = typeof DB_TABLES[number];
`;

// Write the content to DbTables.ts
fs.writeFileSync(path.resolve(__dirname, "DbTables.ts"), dbTablesContent);

console.log("DbTables.ts has been updated successfully.");
