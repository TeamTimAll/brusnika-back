import { faker } from "@faker-js/faker";
import { QueryBuilder } from "typeorm";

import { RoleType } from "../../constants";
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
	| "created_at"
	| "updated_at"
	| "is_active"
	| "temporary_email"
	| "email_verification_code_sent_date"
	| "email_verification_code"
	| "temporary_number"
	| "verification_code_sent_date"
	| "verification_code"
	| "workStartDate"
>;

export async function up(
	query: QueryBuilder<object>,
	cities: CityEntity[],
): Promise<UserEntity[]> {
	const users: IUserEntity[] = [
		{
			firstName: "Jon",
			lastName: "Doe",
			fullName: "Jon Doe Admin",
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
			fullName: "Jon Doe Agent",
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
			fullName: "Jon Doe Agent Blocked",
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
			fullName: "Jon Doe Manager",
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
			fullName: "Саша, Шура- Alexander (ADMIN)",
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
			fullName: "Саша, Шура- Alexander (AGENT)",
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
			fullName: "Саша, Шура- Alexander (MANAGER)",
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
			fullName: "Саша, Шура- Alexander (NEW_MEMBER)",
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
			fullName: "Саша, Шура- Alexander (HEAD_OF_AGENCY)",
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
			fullName: "Саша, Шура- Alexander (OZK_MANAGER)",
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
			fullName: "Саша, Шура- Alexander",
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

	const { generatedMaps } = await query
		.insert()
		.into(UserEntity)
		.values(users)
		.returning("*")
		.execute();
	return generatedMaps as UserEntity[];
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(UserEntity).execute();
}
