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

const seedTable = new Map([
	["city", citySeed],
	["project", projectSeed],
	["building", buildingSeed],
	["premise", premiseSeed],
	["user", userSeed],
	["client", clientSeed],
]);

// -----------------Planting seeds-----------------
async function up(dataSource: DataSource, module: string) {
	const seed = seedTable.get(module);
	if (!seed) {
		throw new Error(`${module}, module is not correct!`);
	}
	await seed.up(dataSource.createQueryBuilder());
}

async function down(dataSource: DataSource, module: string) {
	const seed = seedTable.get(module);
	if (!seed) {
		throw new Error(`${module}, module is not correct!`);
	}
	await seed.down(dataSource.createQueryBuilder());
}
// ------------------------------------------------

async function createDataSource() {
	const command = process.argv[2];
	const module = process.argv[3];
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
			await up(dataSource, module);
			break;
		}
		case "down": {
			await down(dataSource, module);
			break;
		}
	}

	await dataSource.destroy();
}

void createDataSource();
