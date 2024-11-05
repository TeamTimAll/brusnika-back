import { DataSource } from "typeorm";
import {
	addTransactionalDataSource,
	initializeTransactionalContext,
} from "typeorm-transactional";

import { ConfigManager } from "../config";

export class OrmManager {
	public static dataSource: DataSource;

	static init() {
		this.dataSource = new DataSource(ConfigManager.databaseConfig);

		initializeTransactionalContext();
		addTransactionalDataSource(this.dataSource);
	}
}
