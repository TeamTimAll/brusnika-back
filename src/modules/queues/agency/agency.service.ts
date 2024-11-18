import { Injectable } from "@nestjs/common";

import { AgencyService } from "../../agencies/agencies.service";
import { CityService } from "../../cities/cities.service";

import { AgencyDto, AgenciesDto } from "./dto";

@Injectable()
export class AgencyQueueService {
	constructor(
		private readonly citiesService: CityService,
		private readonly service: AgencyService,
	) {}

	async createOrUpdateAgency(payload: AgencyDto) {
		const city = await this.citiesService.readOneByExtId(
			payload.city_ext_id,
		);

		return this.service.repository
			.createQueryBuilder()
			.insert()
			.values({
				authority_signatory_doc: payload.authority_signatory_doc,
				city_id: city.id,
				company_card_doc: payload.company_card_doc,
				email: payload.email,
				entry_doc: payload.entry_doc,
				inn: payload.inn,
				legalName: payload.legalName,
				ownerFullName: payload.ownerFullName,
				ownerPhone: payload.ownerFullName,
				phone: payload.phone,
				tax_registration_doc: payload.tax_registration_doc,
				title: payload.title,
			})
			.orUpdate(
				[
					"authority_signatory_doc",
					"city_id",
					"company_card_doc",
					"email",
					"entry_doc",
					"inn",
					"legalName",
					"ownerFullName",
					"ownerPhone",
					"phone",
					"tax_registration_doc",
					"title",
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
}
