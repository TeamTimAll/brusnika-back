import { QueryBuilder } from "typeorm";

import { RoleType } from "../../constants";
import { CityEntity } from "../../modules/cities/cities.entity";
import { UserEntity, UserRegisterStatus } from "../../modules/user/user.entity";

export async function up(query: QueryBuilder<object>) {
	const [city] = await query
		.select("id")
		.from(CityEntity, "c")
		.where("name = :name", {
			name: "Москва",
		})
		.limit(1)
		.getRawMany<CityEntity>();
	const users: Omit<
		UserEntity,
		"id" | "city" | "agency" | "createdAt" | "updatedAt"
	>[] = [
		{
			firstName: "Jon",
			lastName: "Doe",
			fullName: "Jon Doe",
			role: RoleType.USER,
			email: "jondoe@gmail.com",
			username: "jon",
			password: "jondoe",
			phone: "71234567890",
			birthDate: new Date("2001-01-14"),
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},

		{
			firstName: "Jon",
			lastName: "Doe",
			fullName: "Jon Doe Admin",
			role: RoleType.ADMIN,
			email: "jondoeadmin@gmail.com",
			username: "jonadmin",
			password: "jondoeadmin",
			phone: "71234567891",
			birthDate: new Date("2001-01-15"),
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
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
			birthDate: new Date("2001-01-16"),
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
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
			birthDate: new Date("2001-09-11"),
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: false,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},

		{
			firstName: "Jon",
			lastName: "Doe",
			fullName: "Jon Doe Employee",
			role: RoleType.EMPLOYEE,
			email: "jondoeemployee@gmail.com",
			username: "jonemployee",
			password: "jondoeemployee",
			phone: "71234567893",
			birthDate: new Date("2001-01-17"),
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
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
			birthDate: new Date("2001-01-18"),
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},

		{
			phone: "2222222221",
			role: RoleType.USER,
			fullName: "Саша, Шура- Alexander",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_user",
			password: "sasha_user",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222222",
			role: RoleType.ADMIN,
			fullName: "Саша, Шура- Alexander (ADMIN)",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_admin",
			password: "sasha_admin",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222223",
			role: RoleType.AGENT,
			fullName: "Саша, Шура- Alexander (AGENT)",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_agent",
			password: "sasha_agent",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222224",
			role: RoleType.MANAGER,
			fullName: "Саша, Шура- Alexander (MANAGER)",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_manager",
			password: "sasha_manager",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222225",
			role: RoleType.EMPLOYEE,
			fullName: "Саша, Шура- Alexander (EMPLOYEE)",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_employee",
			password: "sasha_employee",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222226",
			role: RoleType.NEW_MEMBER,
			fullName: "Саша, Шура- Alexander (NEW_MEMBER)",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_new_member",
			password: "sasha_new_member",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222227",
			role: RoleType.HEAD_OF_AGENCY,
			fullName: "Саша, Шура- Alexander (HEAD_OF_AGENCY)",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_head_of_agency",
			password: "sasha_head_of_agency",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222228",
			role: RoleType.OZK_MANAGER,
			fullName: "Саша, Шура- Alexander (OZK_MANAGER)",
			firstName: "Саша",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_ozk_manager",
			password: "sasha_ozk_manager",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
		{
			phone: "2222222229",
			role: RoleType.AFFILIATE_MANAGER,
			fullName: "Саша, Шура- Alexander",
			firstName: "Саша (AFFILIATE_MANAGER)",
			lastName: "Шура",
			birthDate: new Date("2001-01-18"),
			email: null,
			username: "sasha_affiliate_manager",
			password: "sasha_affiliate_manager",
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: true,
			isPhoneVerified: true,
			city_id: city.id,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			temporaryEmail: null
		},
	];

	await query.insert().into(UserEntity).values(users).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(UserEntity).execute();
}
