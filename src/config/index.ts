import "dotenv/config";
import * as Joi from "joi";

import { DatabaseConfig, DatabaseConfigManager } from "./database";
// import { DatabaseConfig, DatabaseConfigManager } from './database';

export type NodeEnv = "development" | "production" | "test";

export interface IConfig {
	NODE_ENV: NodeEnv;
	SERVER_PORT: number;
	DB_TYPE: string;
	DB_HOST: string;
	DB_PORT: number;
	DB_USERNAME: string;
	DB_PASSWORD: string;
	DB_DATABASE: string;
	JWT_PRIVATE_KEY: string;
	JWT_PUBLIC_KEY: string;
	JWT_EXPIRATION_TIME: number;
	API_VERSION: string;
	PUBLIC_KEY: string;
	PRIVATE_KEY: string;
	LINK_ENCRYPTION_KEY: string;
}

export class ConfigManager {
	public static config: IConfig = {
		SERVER_PORT: Number(process.env.SERVER_PORT),
		NODE_ENV: process.env.NODE_ENV as NodeEnv,
		DB_TYPE: process.env.DB_TYPE as string,
		DB_HOST: process.env.DB_HOST as string,
		DB_PORT: process.env.DB_PORT as unknown as number,
		DB_USERNAME: process.env.DB_USERNAME as string,
		DB_PASSWORD: process.env.DB_PASSWORD as string,
		DB_DATABASE: process.env.DB_DATABASE as string,
		JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY as string,
		JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY as string,
		JWT_EXPIRATION_TIME: process.env
			.JWT_EXPIRATION_TIME as unknown as number,
		API_VERSION: process.env.API_VERSION as string,
		PUBLIC_KEY: process.env.PUBLIC_KEY?.replace(/\\n/g, "\n") as string,
		PRIVATE_KEY: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n") as string,
		LINK_ENCRYPTION_KEY: process.env.LINK_ENCRYPTION_KEY as string,
	};

	public static get databaseConfig(): DatabaseConfig {
		return DatabaseConfigManager.config;
	}

	private static configSchema = Joi.object<IConfig, true>({
		SERVER_PORT: Joi.number().required(),
		NODE_ENV: Joi.string()
			.valid(...(["development", "production", "test"] as NodeEnv[]))
			.required(),
		DB_TYPE: Joi.string().required(),
		DB_HOST: Joi.string().required(),
		DB_PORT: Joi.number().required(),
		DB_USERNAME: Joi.string().required(),
		DB_PASSWORD: Joi.string().required(),
		DB_DATABASE: Joi.string().required(),
		JWT_PRIVATE_KEY: Joi.string().required(),
		JWT_PUBLIC_KEY: Joi.string().required(),
		JWT_EXPIRATION_TIME: Joi.number().required(),
		API_VERSION: Joi.string().optional(),
		PUBLIC_KEY: Joi.string().required(),
		PRIVATE_KEY: Joi.string().required(),
		LINK_ENCRYPTION_KEY: Joi.string().required(),
	});

	static init() {
		const { error } = this.configSchema.validate(this.config, {
			abortEarly: false,
		});

		if (error) {
			error.details.map((value) => {
				console.error("[ENV] " + value.message);
			});
			process.exit(1);
		}
	}

	static isProduction(): boolean {
		return this.config.NODE_ENV === "production";
	}

	static isDevelopment(): boolean {
		return this.config.NODE_ENV === "development";
	}
}
