import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { AgencyService } from "../../agencies/agencies.service";
import { CityService } from "../../cities/cities.service";
import { BaseDto } from "../../../common/base/base_dto";
import { QueueService } from "../queue.service";
import { AgencyEntity } from "../../agencies/agencies.entity";
import { CityEntity } from "../../cities/cities.entity";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";

import { AgencyDto, AgenciesDto } from "./dto";
import { IAgency } from "./types";

@Injectable()
export class AgencyQueueService {
	constructor(
		private readonly citiesService: CityService,
		private readonly queueService: QueueService,
		@Inject(forwardRef(() => UserService))
		private readonly usersService: UserService,
		@Inject(forwardRef(() => AgencyService))
		private readonly service: AgencyService,
	) {}

	async createOrUpdateAgency(payload: AgencyDto) {
		let city: Pick<CityEntity, "id"> | undefined;
		if (payload.city_ext_id) {
			city = await this.citiesService.readOneByExtId(payload.city_ext_id);
		}

		let user: Pick<UserEntity, "id"> | undefined;
		if (payload.user_ext_id) {
			user = await this.usersService.readOneByExtId(payload.user_ext_id, {
				id: true,
			});
		}

		return this.service.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: payload.ext_id,
				authority_signatory_doc: payload.authority_signatory_doc,
				city_id: city?.id,
				company_card_doc: payload.company_card_doc,
				email: payload.email,
				entry_doc: payload.entry_doc,
				inn: payload.inn,
				legalName: payload.legalName,
				ownerFullName: payload.ownerFullName,
				ownerPhone: payload.ownerPhone,
				phone: payload.phone,
				tax_registration_doc: payload.tax_registration_doc,
				title: payload.title,
				create_by_id: user?.id,
			})
			.orUpdate(
				[
					"authority_signatory_doc",
					"city_id",
					"company_card_doc",
					"email",
					"entry_doc",
					"inn",
					"legal_name",
					"owner_full_name",
					"owner_phone",
					"phone",
					"tax_registration_doc",
					"title",
					"create_by_id",
				],
				["ext_id"],
			)
			.execute();
	}

	async createAgencies({ data: agencies }: AgenciesDto) {
		for await (const agency of agencies) {
			await this.createOrUpdateAgency(agency);
		}
	}

	async makeRequest(agency: IAgency) {
		const data: Pick<BaseDto<IAgency>, "data"> = {
			data: agency,
		};
		await this.queueService.send(data);
	}

	async createFormEntity(agency: AgencyEntity): Promise<IAgency> {
		let city: CityEntity | undefined;
		if (agency.city_id) {
			city = await this.citiesService.readOne(agency.city_id);
		}

		let user: UserEntity | undefined;
		if (agency.create_by_id) {
			user = await this.usersService.readOne(agency.create_by_id);
		}

		return {
			url: "https://1c.tarabanov.tech/crm/hs/ofo/AgreementWithAgent",
			method: "POST",
			data: {
				contourId: "36cba4b9-1ef1-11e8-90e9-901b0ededf35",
				city: city?.name,
				agency: agency.title,
				organizationalLegalForm: agency.legalName,
				inn: agency.inn,
				phone: agency.phone,
				email: agency.email,
				// taxRegistrationRef: `https://test-api-brusnika.teamtim.tech/api/files/${agency.tax_registration_doc}`,
				// ogrnRef:  `https://test-api-brusnika.teamtim.tech/api/files/${agency.entry_doc}`,
				// agencyRef: `https://test-api-brusnika.teamtim.tech/api/files/${agency.company_card_doc}` ,
				// basisForSigningRef: `https://test-api-brusnika.teamtim.tech/api/files/${agency.authority_signatory_doc}` ,
				taxRegistrationRef: `https://api-brusnika.teamtim.tech/api/files/1732007589874.jpeg`,
				ogrnRef: `https://api-brusnika.teamtim.tech/api/files/1732007589874.jpeg`,
				agencyRef: `https://api-brusnika.teamtim.tech/api/files/1732007589874.jpeg`,
				basisForSigningRef: `https://api-brusnika.teamtim.tech/api/files/1732007589874.jpeg`,
				contactPersonName: user?.firstName,
				contactPersonPosition: user?.role,
				contactPersonPhone: user?.phone,
				citiesWork: [city?.name],
				agencyFull: "testagency LLC",
				okved: "711111111",
				registrationAgencyDate: "2024-11-18",
				vatAvailability: true,
				agencyWorkingTerm: {
					count: 10,
					unit: "MONTH",
				},
				employees: 10,
				reasonAgreements: "testagency.ru",
				agreementsAnotherDeveloper: {
					availability: true,
					developerList: ["testdev"],
				},
				associations: {
					availability: true,
					associationList: ["testagency"],
				},
				amountDealsMonth: "LESS_THAN_10",
				signer: "testuser",
				basisForSigning: "testuser",
				siteLinks: ["testagency.ru"],
			},
		};
	}
}
