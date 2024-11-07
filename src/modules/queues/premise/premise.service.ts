import { Injectable } from "@nestjs/common";

import { PremisesService } from "../../premises/premises.service";
import { SectionEntity } from "../../sections/sections.entity";
import { BuildingsService } from "../../buildings/buildings.service";
import { SectionsService } from "../../sections/sections.service";

import { PremiseDto } from "./dto";

@Injectable()
export class PremiseQueueService {
	constructor(
		private readonly premiseService: PremisesService,
		private readonly buildingService: BuildingsService,
		private readonly sectionService: SectionsService,
	) {}

	async createOrUpdatePremise(premise: PremiseDto) {
		const building = await this.buildingService.readOneByExtId(
			premise.building_ext_id,
			{ id: true },
		);

		let section: Pick<SectionEntity, "id"> | undefined;
		if (premise.section_ext_id) {
			section = await this.sectionService.readOneByExtId(
				premise.section_ext_id,
				{ id: true },
			);
		}
		return this.premiseService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: premise.ext_id,
				name: premise.name,
				type: premise.type,
				building_id: building.id,
				price: premise.price,
				size: premise.size,
				status: premise.status,
				number: premise.number,
				link: premise.link,
				floor: premise.floor,
				photo: premise.photo,
				rooms: premise.rooms,
				photos: premise.photos,
				similiarApartmentCount: premise.similiarApartmentCount,
				mortagePayment: premise.mortagePayment,
				section_id: section?.id,
				purchase_option: premise.purchase_option,
			})
			.orUpdate(
				[
					"name",
					"type",
					"price",
					"size",
					"status",
					"number",
					"link",
					"floor",
					"photo",
					"rooms",
					"photos",
					"similiar_apartment_count",
					"mortage_payment",
					"section_id",
					"purchase_option",
				] as Array<keyof PremiseDto>,
				["ext_id"],
			)
			.execute();
	}
}
