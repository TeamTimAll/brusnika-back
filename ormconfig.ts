import "./src/boilerplate.polyfill";

import { DataSource } from "typeorm";

import { ConfigManager } from "./src/config";

ConfigManager.init();
export const dataSource = new DataSource(ConfigManager.databaseConfig);
