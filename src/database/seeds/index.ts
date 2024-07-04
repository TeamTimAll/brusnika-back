import { DataSource, QueryBuilder } from "typeorm";

import { ConfigManager } from "../../config";
import {
	PremisesEntity,
	PremisesType,
} from "../../modules/premises/premises.entity";

ConfigManager.init();
export const dataSource = new DataSource(ConfigManager.databaseConfig);

async function up(query: QueryBuilder<object>) {
	await query
		.insert()
		.into(PremisesEntity)
		.values({ type: PremisesType.APARTMENT, floor: 5 })
		.execute();
}

async function down(query: QueryBuilder<object>) {
	await query.delete().from(PremisesEntity).execute();
}

async function createDataSource() {
	const command = process.argv[2];
	if (!command || !command.length) {
		throw new Error("unknown command! try up or down");
	}
	if (command !== "up" && command !== "down") {
		throw new Error("unknown command! try up or down");
	}
	await dataSource.initialize();

	const query = dataSource.createQueryBuilder();

	switch (command) {
		case "up": {
			await up(query);
			break;
		}
		case "down": {
			await down(query);
			break;
		}
	}

	await dataSource.destroy();
}

void createDataSource();
