import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { v4 as uuid } from "uuid";

import { ConfigManager } from "../../config";
import { RoleType } from "../../constants";
import { ServiceResponse } from "../../interfaces/serviceResponse.interface";
import { AgenciesEntity } from "../agencies/agencies.entity";
import { AgenciesService } from "../agencies/agencies.service";
import { AgencyNotFoundError } from "../agencies/errors/AgencyNotFound.error";
import { BuildingsEntity } from "../buildings/buildings.entity";
import { BuildingsService } from "../buildings/buildings.service";
import { CreateBuilding } from "../buildings/dtos/building.create.dto";
import { BuildingNotFoundError } from "../buildings/errors/BuildingNotFound.error";
import { CitiesEntity } from "../cities/cities.entity";
import { CitiesService } from "../cities/cities.service";
import { ClientStatusEntity } from "../client-status/client-status.entity";
import { ClientStatusService } from "../client-status/client-status.service";
import { ClientEntity } from "../client/client.entity";
import { ClientService } from "../client/client.service";
import { ClientNotFoundError } from "../client/errors/ClientNotFound.error";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremisesEntity, PremisesType } from "../premises/premises.entity";
import { PremisesService } from "../premises/premises.service";
import { CreateProjectDto } from "../projects/dto/project.create.dto";
import { ProjectNotFoundError } from "../projects/errors/ProjectNotFound.error";
import { ProjectEntity } from "../projects/project.entity";
import { ProjectsService } from "../projects/projects.service";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { CreateLeadDto } from "./dtos/leads.create.dto";
import { LeadOpsEntity } from "./lead_ops.entity";
import { LeadsEntity } from "./leads.entity";
import { LeadsService } from "./leads.service";

describe(LeadsService.name, () => {
	let leadsService: LeadsService;
	let clientService: ClientService;
	let userService: UserService;
	let agenciesService: AgenciesService;
	let citiesService: CitiesService;
	let premisesService: PremisesService;
	let buildingsService: BuildingsService;
	let projectsService: ProjectsService;

	const input = new CreateLeadDto();
	let manager: UserEntity;
	let client: ClientEntity;
	let city: ServiceResponse<CitiesEntity>;
	let agent: ServiceResponse<AgenciesEntity>;
	let project: CreateProjectDto & ProjectEntity;
	let building: CreateBuilding & BuildingsEntity;
	let premise: ServiceResponse<PremisesEntity>;
	let expectedOutput: LeadsEntity;

	let moduleRef: TestingModule;

	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					...ConfigManager.databaseConfig,
					database: "__test__",
					dropSchema: true,
					logging: false,
				}),
				TypeOrmModule.forFeature([
					LeadsEntity,
					LeadOpsEntity,
					ClientEntity,
					ClientStatusEntity,
					ProjectEntity,
					PremisesEntity,
					BuildingsEntity,
					AgenciesEntity,
					UserEntity,
				]),
			],
			providers: [
				LeadsService,
				ClientService,
				UserService,
				AgenciesService,
				CitiesService,
				PremisesService,
				BuildingsService,
				ProjectsService,
				ClientStatusService,
			],
		}).compile();

		leadsService = moduleRef.get(LeadsService);
		clientService = moduleRef.get(ClientService);
		userService = moduleRef.get(UserService);
		agenciesService = moduleRef.get(AgenciesService);
		citiesService = moduleRef.get(CitiesService);
		premisesService = moduleRef.get(PremisesService);
		buildingsService = moduleRef.get(BuildingsService);
		projectsService = moduleRef.get(ProjectsService);

		manager = await userService.createUser({
			phone: "+78932154",
			role: RoleType.MANAGER,
		});
		client = await clientService.create({
			fullname: "Test client",
			phone_number: "+78932154",
			actived_date: new Date(),
			expiration_date: new Date(),
		});
		city = await citiesService.create<CitiesEntity>({
			name: "Test city",
		});
		agent = await agenciesService.create<AgenciesEntity>({
			title: "Test agent",
			city_id: city.data[0].id,
		});
		project = await projectsService.createProjects({
			name: "Test project",
			detailed_description: "Test project",
			brief_description: "Test project",
			price: 0,
			location: "Test project",
			end_date: new Date(),
			photo: "",
			long: "0",
			lat: "0",
		});
		building = await buildingsService.createBuilding({
			name: "Test building",
			total_storage: 0,
			total_vacant_storage: 0,
			total_apartment: 0,
			total_vacant_apartment: 0,
			total_parking_space: 0,
			total_vacant_parking_space: 0,
			total_commercial: 0,
			total_vacant_commercial: 0,
			address: "Test address",
			number_of_floors: 0,
			photos: [],
			project_id: project.id,
		});
		premise = await premisesService.create<PremisesEntity>({
			type: PremisesType.APARTMENT,
			name: "Test premise",
			building_id: building.id,
		});
		input.clinet_id = client.id;
		input.agent_id = agent.data[0].id;
		input.manager_id = manager.id;
		input.premise_id = premise.data[0].id;
		input.fee = 0;

		expectedOutput = new LeadsEntity();
		expectedOutput.clinet_id = client.id;
		expectedOutput.agent_id = agent.data[0].id;
		expectedOutput.manager_id = manager.id;
		expectedOutput.premise_id = premise.data[0].id;
		expectedOutput.fee = 0;
	});

	afterEach(async () => {
		const dataSource = moduleRef.get(DataSource);
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(LeadOpsEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(LeadsEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(ClientStatusEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(UserEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(CitiesEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(AgenciesEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(ProjectEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(BuildingsEntity).execute();
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(PremisesEntity).execute();
		await moduleRef.close();
	});

	describe("LeadsService.create", () => {
		test("should return a lead", async () => {
			const new_lead = await leadsService.create(input);
			expect(new_lead).toMatchObject<Partial<LeadsEntity>>({
				clinet_id: expectedOutput.clinet_id,
				agent_id: expectedOutput.agent_id,
				manager_id: expectedOutput.manager_id,
				premise_id: expectedOutput.premise_id,
				fee: expectedOutput.fee,
			});
		});

		test("error: ClientNotFoundError", async () => {
			await expect(async () => {
				const new_input = JSON.parse(
					JSON.stringify(input),
				) as CreateLeadDto;

				new_input.clinet_id = uuid();
				return await leadsService.create(new_input);
			}).rejects.toThrow(ClientNotFoundError);
		});

		test("error: AgencyNotFoundError", async () => {
			await expect(async () => {
				const new_input = JSON.parse(
					JSON.stringify(input),
				) as CreateLeadDto;

				new_input.agent_id = uuid();
				return await leadsService.create(new_input);
			}).rejects.toThrow(AgencyNotFoundError);
		});

		test("error: UserNotFoundError", async () => {
			await expect(async () => {
				const new_input = JSON.parse(
					JSON.stringify(input),
				) as CreateLeadDto;

				new_input.manager_id = uuid();
				return await leadsService.create(new_input);
			}).rejects.toThrow(UserNotFoundError);
		});

		test("error: PremiseNotFoundError", async () => {
			await expect(async () => {
				const new_input = JSON.parse(
					JSON.stringify(input),
				) as CreateLeadDto;

				new_input.premise_id = uuid();
				return await leadsService.create(new_input);
			}).rejects.toThrow(PremiseNotFoundError);
		});

		test("error: BuildingNotFoundError", async () => {
			await expect(async () => {
				const new_input = JSON.parse(
					JSON.stringify(input),
				) as CreateLeadDto;

				const new_premise =
					await premisesService.create<PremisesEntity>({
						type: PremisesType.APARTMENT,
						name: "Test premise",
					});

				new_input.premise_id = new_premise.data[0].id;

				return await leadsService.create(new_input);
			}).rejects.toThrow(BuildingNotFoundError);
		});

		test("error: ProjectNotFoundError", async () => {
			await expect(async () => {
				const new_input = JSON.parse(
					JSON.stringify(input),
				) as CreateLeadDto;

				const new_building = await buildingsService.createBuilding({
					name: "Test building",
					total_storage: 0,
					total_vacant_storage: 0,
					total_apartment: 0,
					total_vacant_apartment: 0,
					total_parking_space: 0,
					total_vacant_parking_space: 0,
					total_commercial: 0,
					total_vacant_commercial: 0,
					address: "Test address",
					number_of_floors: 0,
					photos: [],
					project_id: uuid(),
				});

				const new_premise =
					await premisesService.create<PremisesEntity>({
						type: PremisesType.APARTMENT,
						name: "Test premise",
						building_id: new_building.id,
					});
				new_input.premise_id = new_premise.data[0].id;

				return await leadsService.create(new_input);
			}).rejects.toThrow(ProjectNotFoundError);
		});
	});

	describe("LeadsService.readAll", () => {
		test("read all lead with lead_ops relation", async () => {
			await leadsService.create(input);
			const leads = await leadsService.readAll();
			leads.forEach((l) => {
				expect(l).toMatchObject({
					clinet_id: expect.any(String) as string,
					agent_id: expect.any(String) as string,
					manager_id: expect.any(String) as string,
					project_id: expect.any(String) as string,
					premise_id: expect.any(String) as string,
					fee: expect.any(Number) as number,
				});

				expect(l.lead_ops).not.toEqual([]);

				l.lead_ops?.forEach((o) =>
					expect(o).toMatchObject({
						lead_id: expect.any(String) as string,
						status: expect.any(String) as string,
					}),
				);
			});
		});
	});
});
