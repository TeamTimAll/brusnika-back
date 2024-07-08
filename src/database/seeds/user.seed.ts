import { QueryBuilder } from "typeorm";

import { WithOutToDto } from "types";

import { RoleType } from "../../constants";
import { CitiesEntity } from "../../modules/cities/cities.entity";
import { UserEntity, UserRegisterStatus } from "../../modules/user/user.entity";

export async function up(query: QueryBuilder<object>) {
	const [city] = await query
		.select("id")
		.from(CitiesEntity, "c")
		.where("name = :name", {
			name: "Москва",
		})
		.limit(1)
		.getRawMany<CitiesEntity>();
	const cities: WithOutToDto<
		Omit<UserEntity, "id" | "city" | "agency" | "createdAt" | "updatedAt">
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
			city_id: city.id,
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
			city_id: city.id,
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
			city_id: city.id,
		},

		{
			firstName: "Jon",
			lastName: "Doe",
			fullName: "Jon Doe Agent Blocked",
			role: RoleType.AGENT,
			email: "jondoeagentblocked@gmail.com",
			username: "jonagentblocked",
			password: "jondoeagentblocked",
			phone: "71234567892",
			birthDate: new Date("2001-09-11"),
			workStartDate: null,
			verification_code: null,
			verification_code_sent_date: null,
			avatar: "user_default_avatar.png",
			register_status: UserRegisterStatus.FINISHED,
			temporaryNumber: null,
			status: false,
			city_id: city.id,
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
			city_id: city.id,
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
			city_id: city.id,
		},
	];

	await query.insert().into(UserEntity).values(cities).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(UserEntity).execute();
}
