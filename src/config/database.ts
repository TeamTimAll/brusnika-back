// import fs from "fs";
import { join } from "path";

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { SnakeNamingStrategy } from "../lib/snake-naming.strategy";

import { ConfigManager } from "./";

export type DatabaseConfig = PostgresConnectionOptions;

export class DatabaseConfigManager {
	static get config(): DatabaseConfig {
		const databaseConfig: DatabaseConfig = {
			type: "postgres",
			host: ConfigManager.config.DB_HOST,
			port: ConfigManager.config.DB_PORT,
			username: ConfigManager.config.DB_USERNAME,
			password: ConfigManager.config.DB_PASSWORD,
			database: ConfigManager.config.DB_DATABASE,
			namingStrategy: new SnakeNamingStrategy(),
			// ssl: ConfigManager.isProduction()
			// 	?   {
			// 			ca: fs.readFileSync("postgresql.pem").toString(),
			// 			rejectUnauthorized: true,
			// 		}
			// 	: undefined,
			logging: false,
			synchronize: true,
			entities: [
				join(__dirname, "..", "/**/*.entity{.ts,.js}"),
				join(__dirname, "..", "/**/*.view-entity{.ts,.js}"),
			],
			migrations: [
				join(__dirname, "..", "src/database/migrations/*{.ts,.js}"),
			],
		};
		return databaseConfig;
	}
}
