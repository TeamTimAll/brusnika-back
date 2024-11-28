import { DataSource } from "typeorm";

import { ConfigManager } from "../../config";
import { RoleType } from "../../constants";

import * as agencySeed from "./agency.seed";
import * as bookedSeed from "./booked.seed";
import * as buildingSeed from "./building.seed";
import * as citySeed from "./city.seed";
import * as clientSeed from "./client.seed";
import * as leadSeed from "./lead.seed";
import * as premiseSeed from "./premise.seed";
import * as projectSeed from "./project.seed";
import * as sectionSeed from "./section.seed";
import * as settingsSeed from "./settings.seed";
import * as userSeed from "./user.seed";
// import { LeadOpStatus } from "modules/leads/lead_ops.entity";

ConfigManager.init();
export const dataSource = new DataSource({
	...ConfigManager.databaseConfig,
	migrationsRun: false,
});

// -----------------Planting seeds-----------------
// prettier-ignore
async function up(dataSource: DataSource) {
	await settingsSeed.up(dataSource.createQueryBuilder());
	const cities	= await citySeed.up(dataSource.createQueryBuilder());
	// const agencies	= await agencySeed.up(dataSource.createQueryBuilder(), cities);
	// const projects	= await projectSeed.up(dataSource.createQueryBuilder(), cities);
	// const buildings	= await buildingSeed.up(dataSource.createQueryBuilder(), projects);
	// const projects	= await projectSeed.up(dataSource.createQueryBuilder());
	// const sections	= await sectionSeed.up(dataSource.createQueryBuilder(), buildings);
	// const premises	= await premiseSeed.up(dataSource.createQueryBuilder(), buildings, sections);
	// const clients	= await clientSeed.up(dataSource.createQueryBuilder(), users.filter(e => e.role === RoleType.AGENT));
	// const agencies	= await agencySeed.up(dataSource.createQueryBuilder());
	const buildings	= await buildingSeed.up(dataSource.createQueryBuilder());
	const premises	= await premiseSeed.up(dataSource.createQueryBuilder());
	// const users		= await userSeed.up(dataSource.createQueryBuilder(), cities, agencies);
	const clients	= await clientSeed.up(dataSource.createQueryBuilder());
	/*const leads		=*/ await leadSeed.up(dataSource.createQueryBuilder(), clients, buildings, premises);
	// const bookedLeads = leads.filter(l => l.current_status === LeadOpStatus.BOOKED);
	// const bookedClients = clients.filter(c => c.id === )
	// await bookedSeed.up(dataSource.createQueryBuilder(), clients.filter(c => c.confirmation_type));
}

async function down(dataSource: DataSource) {
	await settingsSeed.down(dataSource);
	await citySeed.down(dataSource);
	await projectSeed.down(dataSource);
	await buildingSeed.down(dataSource);
	await sectionSeed.down(dataSource);
	await premiseSeed.down(dataSource);
	await clientSeed.down(dataSource);
	await leadSeed.down(dataSource);
	await userSeed.down(dataSource);
	await agencySeed.down(dataSource);
	await bookedSeed.down(dataSource);
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
