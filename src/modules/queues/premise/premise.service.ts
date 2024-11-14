import { BadRequestException, Injectable } from "@nestjs/common";

import { PremisesService } from "../../premises/premises.service";
import { SectionEntity } from "../../sections/sections.entity";
import { BuildingsService } from "../../buildings/buildings.service";
import { SectionsService } from "../../sections/sections.service";

import { PremiseDto, PremisesDto } from "./dto";
import { IPremise } from "./types";

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
				feature: premise.feature,
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
					"feature",
				] as Array<keyof PremiseDto>,
				["ext_id"],
			)
			.execute();
	}

	async createPremises({ data: premises }: PremisesDto) {
		const preparedValues: IPremise[] = [];

		for await (const premise of premises) {
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

			preparedValues.push({
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
				feature: premise.feature,
			});
		}

		if (preparedValues.length > 0) {
			return this.premiseService.repository
				.createQueryBuilder()
				.insert()
				.values(preparedValues)
				.execute();
		} else {
			throw new BadRequestException("No valid project data to insert.");
		}
	}
}
