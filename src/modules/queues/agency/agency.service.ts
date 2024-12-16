import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { AgencyService } from "../../agencies/agencies.service";
import { CityService } from "../../cities/cities.service";
import { BaseDto } from "../../../common/base/base_dto";
import { QueueService } from "../queue.service";
import { AgencyEntity } from "../../agencies/agencies.entity";
import { CityEntity } from "../../cities/cities.entity";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";
import { ConfigManager } from "../../../config";

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

		const inn = payload.inn as unknown as string;

		const agency = await this.service.repository.findOne({
			where: { inn: inn },
		});

		if (agency) {
			return await this.service.repository
				.createQueryBuilder()
				.update()
				.set({
					authority_signatory_doc: payload.authority_signatory_doc,
					city_id: city?.id,
					company_card_doc: payload.company_card_doc,
					email: payload.email,
					entry_doc: payload.entry_doc,
					legalName: payload.legalName,
					ownerFullName: payload.ownerFullName,
					ownerPhone: payload.ownerPhone,
					phone: payload.phone,
					tax_registration_doc: payload.tax_registration_doc,
					title: payload.title,
					create_by_id: user?.id,
				})
				.where("id = :id", { id: agency.id })
				.execute();
		} else {
			return await this.service.repository
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
				.execute();
		}
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

		const DEBUG = ConfigManager.config.DEBUG;

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
				taxRegistrationRef: DEBUG
					? `https://api-brusnika.teamtim.tech/api/files/1732600146726.pdf`
					: agency.tax_registration_doc,

				ogrnRef: DEBUG
					? `https://api-brusnika.teamtim.tech/api/files/1732600146726.pdf`
					: agency.entry_doc,
				agencyRef: DEBUG
					? `https://api-brusnika.teamtim.tech/api/files/1732600146726.pdf`
					: agency.company_card_doc,
				basisForSigningRef: DEBUG
					? `https://api-brusnika.teamtim.tech/api/files/1732600146726.pdf`
					: agency.authority_signatory_doc,
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

	async createFormEntityV2(agency: AgencyEntity): Promise<IAgency> {
		let city: CityEntity | undefined;
		if (agency.city_id) {
			city = await this.citiesService.readOne(agency.city_id);
		}

		let user: UserEntity | undefined;
		if (agency.create_by_id) {
			user = await this.usersService.readOne(agency.create_by_id);
		}

		const BASE_URL = ConfigManager.config.BASE_URL;

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
				taxRegistrationRef: `${BASE_URL}/${agency.tax_registration_doc}`,
				ogrnRef: `${BASE_URL}/${agency.entry_doc}`,
				agencyRef: `${BASE_URL}/${agency.company_card_doc}`,
				basisForSigningRef: `${BASE_URL}/${agency.authority_signatory_doc}`,
				contactPersonName: user?.firstName,
				contactPersonPosition: user?.role,
				contactPersonPhone: user?.phone,
				citiesWork: agency.citiesWork ?? [],
				agencyFull: agency.title ?? "testagency LLC",
				okved: agency.okved ?? "711111111",
				registrationAgencyDate:
					agency.registrationAgencyDate || "2024-11-18",
				vatAvailability: agency.vatAvailability ?? true,
				agencyWorkingTerm: {
					count: agency.termCount ?? 10,
					unit: agency.termUnit ?? "MONTH",
				},
				employees: agency.employees ?? 10,
				reasonAgreements: agency.reasonAgreements ?? "pochemu...",
				agreementsAnotherDeveloper: {
					availability: agency.agreementsAnotherDeveloper?.length
						? true
						: false,
					developerList: agency.agreementsAnotherDeveloper ?? [
						"test",
					],
				},
				associations: {
					availability: agency.associations?.length ? true : false,
					associationList: agency.associations ?? ["test"],
				},
				amountDealsMonth: agency.amountDealsMonth ?? "LESS_THAN_10",
				signer: agency.signer ?? "test",
				basisForSigning: agency.basisForSigning ?? "test",
				siteLinks: agency.site ? [agency.site] : [],
			},
		};
	}
}
