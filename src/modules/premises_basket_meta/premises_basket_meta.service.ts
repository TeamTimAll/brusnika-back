import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreatePremisesBasketMetaDto } from "./dtos/CreatePremisesBasketMeta.dto";
import { PremisesBasketMetaNotFoundError } from "./errors/PremisesBasketMetaNotFound.error";
import { PremisesBasketMetaEntity } from "./premises_basket_meta.entity";

@Injectable()
export class PremisesBasketMetaService {
	constructor(
		@InjectRepository(PremisesBasketMetaEntity)
		private cpbmRepository: Repository<PremisesBasketMetaEntity>,
	) {}

	async getAllBasketMeta(client_id: number) {
		const foundBasket = await this.cpbmRepository.find({
			where: { client: { id: client_id } },
		});
		if (!foundBasket.length) {
			throw new PremisesBasketMetaNotFoundError(
				`client_id: '${client_id}'`,
			);
		}
		return foundBasket;
	}

	createBasketMeta(entity: CreatePremisesBasketMetaDto) {
		const upbmEntity = this.cpbmRepository.create({
			clinet_id: entity.client_id,
		});

		return this.cpbmRepository.save(upbmEntity);
	}
}
