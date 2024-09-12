import { faker } from "@faker-js/faker";
import { QueryBuilder } from "typeorm";

import { RoleType } from "../../constants";
import { chunkArray } from "../../lib/array";
import { AgencyEntity } from "../../modules/agencies/agencies.entity";
import { CityEntity } from "../../modules/cities/cities.entity";
import {
	UserEntity,
	UserRegisterStatus,
	UserStatus,
} from "../../modules/user/user.entity";

type IUserEntity = Omit<
	UserEntity,
	| "id"
	| "city"
	| "agency"
	| "fullName"
	| "created_at"
	| "updated_at"
	| "is_active"
	| "workStartDate"
	| "temporary_email"
	| "temporary_number"
	| "verification_code"
	| "email_verification_code"
	| "verification_code_sent_date"
	| "email_verification_code_sent_date"
>;

function createUser(
	city_id: number,
	role: RoleType,
	agency_id?: number,
): IUserEntity {
	const user: IUserEntity = {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		role: role,
		username: null,
		password: null,
		phone: faker.number
			.bigInt({
				min: 70000000000,
				max: 79999999999,
			})
			.toString(),
		birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
		avatar: "user_default_avatar.png",
		register_status: UserRegisterStatus.FINISHED,
		city_id: city_id,
		agency_id: agency_id,
		is_phone_verified: true,
		status: UserStatus.ACTIVE,
	};
	return user;
}

export async function up(
	query: QueryBuilder<object>,
	cities: CityEntity[],
	agencies: AgencyEntity[],
): Promise<UserEntity[]> {
	const users: IUserEntity[] = [
		{
			firstName: "Jon",
			lastName: "Doe",
			role: RoleType.ADMIN,
			email: "jondoeadmin@gmail.com",
			username: "jonadmin",
			password: "jondoeadmin",
			phone: "71234567891",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},

		{
			firstName: "Jon",
			lastName: "Doe",
			role: RoleType.AGENT,
			email: "jondoeagent@gmail.com",
			username: "jonagent",
			password: "jondoeagent",
			phone: "71234567892",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},

		{
			firstName: "Jon",
			lastName: "Doe",
			role: RoleType.AGENT,
			email: "jondoeagentblocked@gmail.com",
			username: "jonagentblocked",
			password: "jondoeagentblocked",
			phone: "71234567882",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},

		{
			firstName: "Jon",
			lastName: "Doe",
			role: RoleType.MANAGER,
			email: "jondoemanager@gmail.com",
			username: "jonmanager",
			password: "jondoemanager",
			phone: "71234567894",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
		{
			phone: "2222222222",
			role: RoleType.ADMIN,
			firstName: "Саша",
			lastName: "Шура",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			email: null,
			username: "sasha_admin",
			password: "sasha_admin",
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
		{
			phone: "2222222223",
			role: RoleType.AGENT,
			firstName: "Саша",
			lastName: "Шура",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			email: null,
			username: "sasha_agent",
			password: "sasha_agent",
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
		{
			phone: "2222222224",
			role: RoleType.MANAGER,
			firstName: "Саша",
			lastName: "Шура",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			email: null,
			username: "sasha_manager",
			password: "sasha_manager",
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
		{
			phone: "2222222226",
			role: RoleType.NEW_MEMBER,
			firstName: "Саша",
			lastName: "Шура",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			email: null,
			username: "sasha_new_member",
			password: "sasha_new_member",
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
		{
			phone: "2222222227",
			role: RoleType.HEAD_OF_AGENCY,
			firstName: "Саша",
			lastName: "Шура",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			email: null,
			username: "sasha_head_of_agency",
			password: "sasha_head_of_agency",
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
		{
			phone: "2222222228",
			role: RoleType.OZK_MANAGER,
			firstName: "Саша",
			lastName: "Шура",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			email: null,
			username: "sasha_ozk_manager",
			password: "sasha_ozk_manager",
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
		{
			phone: "2222222229",
			role: RoleType.AFFILIATE_MANAGER,
			firstName: "Саша (AFFILIATE_MANAGER)",
			lastName: "Шура",
			birthDate: faker.date.birthdate({ mode: "age", min: 18, max: 65 }),
			email: null,
			username: "sasha_affiliate_manager",
			password: "sasha_affiliate_manager",
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			is_phone_verified: true,
			city_id: faker.helpers.arrayElement(cities).id,
			status: UserStatus.ACTIVE,
		},
	];

	cities.forEach((city) => {
		agencies.forEach((agency) => {
			users.push(createUser(city.id, RoleType.HEAD_OF_AGENCY, agency.id));

			const len = faker.number.int({ min: 5, max: 10 });
			for (let i = 0; i < len; i++) {
				users.push(
					createUser(
						city.id,
						faker.helpers.arrayElement([
							RoleType.AGENT,
							RoleType.MANAGER,
						]),
						agency.id,
					),
				);
			}
		});
	});

	const chunks = chunkArray(users, 100);

	const res: UserEntity[][] = [];
	for await (const chunk of chunks) {
		const { generatedMaps } = await query
			.insert()
			.into(UserEntity)
			.values(chunk)
			.returning("*")
			.execute();
		res.push(generatedMaps as UserEntity[]);
	}
	return res.flat();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(UserEntity).execute();
}
