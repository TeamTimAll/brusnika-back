import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { ConfigManager } from "../../config";
import { ClientStatusEntity } from "../client-status/client-status.entity";

import { ClientEntity, ClientTag } from "./client.entity";
import { ClientService } from "./client.service";
import { ClientDto } from "./dto/client.dto";
import { FilterClientDto } from "./dto/client.search.dto";

describe(ClientService.name, () => {
	let clientService: ClientService;

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
				TypeOrmModule.forFeature([ClientEntity]),
			],
			providers: [ClientService],
		}).compile();

		clientService = moduleRef.get(ClientService);
	});

	afterEach(async () => {
		const dataSource = moduleRef.get(DataSource);
		// prettier-ignore
		await dataSource.createQueryBuilder().delete().from(ClientStatusEntity).execute();
		await moduleRef.close();
	});

	const input = new ClientDto();
	input.fullname = "Test fullname";
	input.phone_number = "+7894561";
	input.actived_date = new Date();
	input.comment = "Test comment";
	input.status = ClientTag.LEAD_VERIFICATION;
	input.expiration_date = new Date();
	input.node = "Test node";

	describe("ClientService.create", () => {
		test("should return a client", async () => {
			const expectedOutput = input;
			const new_clinet = await clientService.create(input);

			expect(new_clinet).toMatchObject<Partial<ClientEntity>>({
				fullname: expectedOutput.fullname,
				phone_number: expectedOutput.phone_number,
				actived_date: expectedOutput.actived_date,
				comment: expectedOutput.comment,
				status: expectedOutput.status,
				expiration_date: expectedOutput.expiration_date,
				node: expectedOutput.node,
			});
		});
	});
	describe("ClientService.readAll", () => {
		test("read all client", async () => {
			await clientService.create(input);
			const clinets = await clientService.readAll();
			clinets.forEach((c) => {
				expect(c).toMatchObject({
					fullname: expect.any(String) as string,
					phone_number: expect.any(String) as string,
					actived_date: expect.any(Date) as Date,
					comment: expect.any(String) as string,
					status: expect.any(String) as string,
					expiration_date: expect.any(Date) as Date,
					node: expect.any(String) as string,
				});
			});
		});
	});

	describe("ClientService.readByFilter", () => {
		test("read by filter client", async () => {
			await clientService.create(input);
			const dto = new FilterClientDto();
			const clinets = await clientService.readByFilter(dto);
			clinets.forEach((c) => {
				expect(c).toMatchObject({
					fullname: expect.any(String) as string,
					phone_number: expect.any(String) as string,
					actived_date: expect.any(Date) as Date,
					comment: expect.any(String) as string,
					status: expect.any(String) as string,
					expiration_date: expect.any(Date) as Date,
					node: expect.any(String) as string,
				});
			});
		});

		test("read by filter with wrong fullname client", async () => {
			await clientService.create(input);
			const dto = new FilterClientDto();
			dto.fullname = "wrong fullname";
			const clinets = await clientService.readByFilter(dto);
			expect(clinets).toEqual([]);
		});
		test("read by filter with wrong phone_number client", async () => {
			await clientService.create(input);
			const dto = new FilterClientDto();
			dto.phone_number = "wrong phone_number";
			const clinets = await clientService.readByFilter(dto);
			expect(clinets).toEqual([]);
		});
		// test("read by filter with wrong project_id client", async () => {
		// 	await clientService.create(input);
		// 	const dto = new FilterClientDto();
		// 	dto.project_id = "wrong project_id";
		// 	const clinets = await clientService.readByFilter(dto);
		// 	expect(clinets).toEqual([]);
		// });
		test("read by filter with wrong actived_from_date client", async () => {
			await clientService.create(input);
			const dto = new FilterClientDto();
			dto.actived_from_date = new Date(Date.now() + 10000);
			const clinets = await clientService.readByFilter(dto);
			expect(clinets).toEqual([]);
		});
		test("read by filter with wrong actived_to_date client", async () => {
			await clientService.create(input);
			const dto = new FilterClientDto();
			dto.actived_to_date = new Date(Date.now() - 10000);
			const clinets = await clientService.readByFilter(dto);
			expect(clinets).toEqual([]);
		});
		// test("read by filter with wrong status client", async () => {
		// 	await clientService.create(input);
		// 	const dto = new FilterClientDto();
		// 	dto.status = "" as LeadOpStatus;
		// 	const clinets = await clientService.readByFilter(dto);
		// 	expect(clinets).toEqual([]);
		// });
	});
});
