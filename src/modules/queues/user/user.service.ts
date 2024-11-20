import { Injectable } from "@nestjs/common";

import { UserService } from "../../user/user.service";
import { CityService } from "../../cities/cities.service";
import { AgencyService } from "../../agencies/agencies.service";
import { CityEntity } from "../../cities/cities.entity";
import { AgencyEntity } from "../../agencies/agencies.entity";
import { BaseDto } from "../../../common/base/base_dto";
import { UserEntity } from "../../user/user.entity";
import { QueueService } from "../queue.service";

import { UserDto } from "./dto";
import { IUser } from "./types";

@Injectable()
export class UserQueueService {
	constructor(
		private readonly userService: UserService,
		private readonly cityService: CityService,
		private readonly agencyService: AgencyService,
		private readonly queueService: QueueService,
	) {}

	async createOrUpdateUser(user: UserDto) {
		let city: Pick<CityEntity, "id"> | undefined;
		if (user.city_ext_id) {
			city = await this.cityService.readOneByExtId(user.city_ext_id, {
				id: true,
			});
		}
		let agency: Pick<AgencyEntity, "id"> | undefined;
		if (user.agency_ext_id) {
			agency = await this.agencyService.readOneByExtId(
				user.agency_ext_id,
				{ id: true },
			);
		}
		return this.userService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: user.ext_id,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				email: user.email,
				username: user.username,
				password: user.password,
				phone: user.phone,
				birthDate: user.birthDate,
				workStartDate: user.workStartDate,
				avatar: user.avatar,
				is_phone_verified: user.is_phone_verified,
				is_email_verified: user.is_email_verified,
				temporary_role: user.temporary_role,
				status: user.status,
				city_id: city?.id,
				agency_id: agency?.id,
			})
			.orUpdate(
				[
					"first_name",
					"last_name",
					"role",
					"email",
					"username",
					"password",
					"phone",
					"birth_date",
					"work_start_date",
					"avatar",
					"is_phone_verified",
					"is_email_verified",
					"temporary_role",
					"status",
					"city_id",
					"agency_id",
				],
				["ext_id"],
			)
			.execute();
	}

	async makeRequest(user: IUser) {
		const data: Pick<BaseDto<IUser>, "data"> = {
			data: user,
		};
		await this.queueService.send(data);
	}

	async createFormEntity(user: UserEntity): Promise<IUser> {
		let city: CityEntity | undefined;
		if (user.city_id) {
			city = await this.cityService.readOne(user.city_id);
		}

		let agency: AgencyEntity | undefined;
		if (user.agency_id) {
			agency = await this.agencyService.readOne(user.agency_id);
		}

		return {
			url: "https://1c.tarabanov.tech/crm/hs/ofo",
			method: "POST",
			data: {
				requestType: "register_partner",
				contourId: "36cba4b9-1ef1-11e8-90e9-901b0ededf35",
				data: {
					phone: user.phone,
					name: user.firstName,
					surname: user.lastName,
					email: user.email,
					work_region: city?.name,
					inn: agency?.inn,
					patronymic: "test",
					type: "type",
				},
			},
		};
	}
}
