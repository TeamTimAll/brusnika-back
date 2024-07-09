import { DataSource } from "typeorm";

import { ConfigManager } from "../../config";

import * as buildingSeed from "./building.seed";
import * as citySeed from "./city.seed";
import * as premiseSeed from "./premise.seed";
import * as projectSeed from "./project.seed";
import * as userSeed from "./user.seed";
import * as clientSeed from "./client.seed";

ConfigManager.init();
export const dataSource = new DataSource(ConfigManager.databaseConfig);

// -----------------Planting seeds-----------------
async function up(dataSource: DataSource) {
	await citySeed.up(dataSource.createQueryBuilder());
	await projectSeed.up(dataSource.createQueryBuilder());
	await buildingSeed.up(dataSource.createQueryBuilder());
	await premiseSeed.up(dataSource.createQueryBuilder());
	await userSeed.up(dataSource.createQueryBuilder());
	await clientSeed.up(dataSource.createQueryBuilder());
}

async function down(dataSource: DataSource) {
	await citySeed.down(dataSource.createQueryBuilder());
	await projectSeed.down(dataSource.createQueryBuilder());
	await buildingSeed.down(dataSource.createQueryBuilder());
	await premiseSeed.down(dataSource.createQueryBuilder());
	await userSeed.down(dataSource.createQueryBuilder());
	await clientSeed.down(dataSource.createQueryBuilder());
}
// ------------------------------------------------

async function createDataSource() {
	const command = process.argv[2];
	if (!command || !command.length) {
		throw new Error("unknown command! try up or down");
	}
	if (command !== "up" && command !== "down") {
		throw new Error("unknown command! try up or down");
	}
	await dataSource.initialize();

	// const query = dataSource.createQueryBuilder();

	switch (command) {
		case "up": {
			await up(dataSource);
			break;
		}
		case "down": {
			await down(dataSource);
			break;
		}
	}

	await dataSource.destroy();
}

void createDataSource();
