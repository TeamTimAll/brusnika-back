import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { UserService } from "../../user/user.service";
import { CityService } from "../../cities/cities.service";
import { AgencyService } from "../../agencies/agencies.service";
import { CityEntity } from "../../cities/cities.entity";
import { AgencyEntity } from "../../agencies/agencies.entity";
import { BaseDto } from "../../../common/base/base_dto";
import { UserEntity } from "../../user/user.entity";
import { QueueService } from "../queue.service";

import { UserDto, UsersDto } from "./dto";
import { IUser } from "./types";

@Injectable()
export class UserQueueService {
	constructor(
		@Inject(forwardRef(() => UserService))
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

	async createUsers({ data: users }: UsersDto) {
		for await (const user of users) {
			await this.createOrUpdateUser(user);
		}
	}

	async makeRequest(user: IUser) {
		const data: Pick<BaseDto<IUser>, "data"> = {
			data: user,
		};
		return await this.queueService.send(data);
	}

	async createFormEntity(user: UserEntity): Promise<IUser> {
		let agency: AgencyEntity | undefined;
		if (user.agency_id) {
			agency = await this.agencyService.readOne(user.agency_id);
		}

		return {
			url: "https://bbk.staging.brusnika.tech/v1/clients",
			method: "POST",
			data: {
				clients: [
					{
						title: user.fullName,
						email: user.email,
						phone: user.phone,
						person: {
							firstName: user.firstName,
							lastName: user.lastName,
							birthday: user.birthDate,
						},
						contactType: {
							isAgent: true,
							isContractor: false,
							isRealEstateAgency: false,
							isClient: false,
							isAppraiser: false,
							isPartnerOnline: false,
						},
						realEstateAgency: {
							id: agency?.ext_id,
						},
						notSendSms: true,
					},
				],
			},
		};
	}
}
