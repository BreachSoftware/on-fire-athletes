import { API_ENDPOINTS, ApiEndpoint } from "./ApiEndpoints";
import { DB_TABLES, DbTable } from "./DbTables";

/**
 * Override prefix for AWS API Gateway URL. Setting this value will override
 * local development URLs with AWS URLs using the specified prefix.
 */
const AWS_DEVELOPMENT_OVERRIDE_PREFIX = undefined;

// We need to know the current environment to determine the API URL and table names
// eslint-disable-next-line no-process-env
const appEnv = process.env.NEXT_PUBLIC_APP_ENV;

/**
 * Prefixes for AWS API Gateway URLs.
 */
const AWS_DEVELOPMENT_API_PREFIX = "dlzd38qso6" // "327o42g0u4";
const AWS_PRODUCTION_API_PREFIX = "dlzd38qso6";

/**
 * Enum representing different environments.
 */
export enum Environment {
	Development = "development",
	Production = "production",
	Local = "local",
}

/**
 * Interface for API configuration.
 */
interface ApiConfig {
	baseUrl: string;
	stage: string;
}

/**
 * Interface for Database configuration.
 */
interface DbConfig {
	tableNames: Record<DbTable, string>;
}

/**
 * Manages API and Database configurations and provides methods to get API URLs and Table Names.
 */
class EnvironmentManager {
	private static instance: EnvironmentManager;
	private currentEnv: Environment;
	private apiConfigs: Record<Environment, ApiConfig>;
	private dbConfigs: Record<Environment, DbConfig>;

	/**
	 * Private constructor to prevent direct construction calls with the `new` operator.
	 */
	private constructor() {
		switch (appEnv) {
			case "production":
				this.currentEnv = Environment.Production;
				break;
			case "local":
				this.currentEnv = Environment.Local;
				break;
			default:
				this.currentEnv = Environment.Development;
				break;
		}

		// Configuration for different environments
		this.apiConfigs = {
			[Environment.Development]: {
				baseUrl: `https://${AWS_DEVELOPMENT_API_PREFIX}.execute-api.us-east-1.amazonaws.com/`,
				stage: Environment.Development,
			},
			[Environment.Production]: {
				baseUrl: `https://${AWS_PRODUCTION_API_PREFIX}.execute-api.us-east-1.amazonaws.com/`,
				stage: Environment.Production,
			},
			[Environment.Local]: {
				baseUrl:
					AWS_DEVELOPMENT_OVERRIDE_PREFIX === undefined
						? "http://localhost:4005/"
						: `https://${AWS_DEVELOPMENT_OVERRIDE_PREFIX}.execute-api.us-east-1.amazonaws.com/`,
				stage: Environment.Local,
			},
		};

		this.dbConfigs = {
			[Environment.Development]: {
				tableNames: DB_TABLES.reduce(
					(acc, table) => {
						acc[table] = `Development-${table}`;
						return acc;
					},
					{} as Record<DbTable, string>,
				),
			},
			[Environment.Production]: {
				tableNames: DB_TABLES.reduce(
					(acc, table) => {
						acc[table] = `${table}`;
						return acc;
					},
					{} as Record<DbTable, string>,
				),
			},
			[Environment.Local]: {
				tableNames: DB_TABLES.reduce(
					(acc, table) => {
						acc[table] = `Development-${table}`;
						return acc;
					},
					{} as Record<DbTable, string>,
				),
			},
		};
	}

	/**
	 * Gets the singleton instance of EnvironmentManager.
	 * @returns {EnvironmentManager} The singleton instance of EnvironmentManager.
	 */
	public static getInstance(): EnvironmentManager {
		if (!EnvironmentManager.instance) {
			EnvironmentManager.instance = new EnvironmentManager();
		}
		return EnvironmentManager.instance;
	}

	/**
	 * Gets the base API URL for the current environment.
	 * @returns {string} The base API URL.
	 */
	private getApiUrl(): string {
		return this.apiConfigs[this.currentEnv].baseUrl;
	}

	/**
	 * Gets the API stage for the current environment.
	 * @returns {string} The API stage.
	 */
	public getApiStage(): string {
		return this.apiConfigs[this.currentEnv].stage;
	}

	/**
	 * Gets the full API URL for a specific endpoint.
	 * @param {ApiEndpoint} endpoint - The API endpoint.
	 * @returns {string} The full API URL for the specified endpoint.
	 */
	public getApiEndpoint(endpoint: ApiEndpoint): string {
		return `${this.getApiUrl()}${endpoint}`;
	}

	/**
	 * Gets the table name for a specified table key based on the current environment.
	 * @param {DbTable} tableKey - The key representing the table.
	 * @returns {string} The table name for the specified table key.
	 */
	public getDbTableName(tableKey: DbTable): string {
		return this.dbConfigs[this.currentEnv].tableNames[tableKey];
	}
}

/**
 * Singleton instance of EnvironmentManager.
 */
export const environmentManager = EnvironmentManager.getInstance();

/**
 * Object containing methods to get URLs for all API endpoints.
 * Usage: apiEndpoints.users() returns the URL for the users API.
 */
export const apiEndpoints = API_ENDPOINTS.reduce(
	(acc, endpoint) => {
		acc[endpoint] = () => {
			return environmentManager
				.getApiEndpoint(endpoint)
				.replace(/_/g, "/");
		};
		return acc;
	},
	{} as Record<ApiEndpoint, () => string>,
);

/**
 * Object containing methods to get table names for all DB tables.
 * Usage: dbTables.gamechangersCards() returns the table name for the GamechangersCards table.
 */
export const dbTables = DB_TABLES.reduce(
	(acc, table) => {
		acc[table] = () => {
			return environmentManager.getDbTableName(table);
		};
		return acc;
	},
	{} as Record<DbTable, () => string>,
);
