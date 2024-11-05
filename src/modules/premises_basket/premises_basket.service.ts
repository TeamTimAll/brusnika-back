import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PremisesBasketNotFoundError } from "./errors/PremisesBasketNotFound.error";
import { PremisesBasketEntity } from "./premises_basket.entity";
import { CreatePremisesBasketDto } from "./dtos/CreatePremisesBasket.dto";

@Injectable()
export class PremisesBasketService {
	constructor(
		@InjectRepository(PremisesBasketEntity)
		private upbRepository: Repository<PremisesBasketEntity>,
	) {}

	async getAllBasket(meta_id: number) {
		const foundBasket = await this.upbRepository.find({
			where: { meta: { id: meta_id } },
		});
		if (!foundBasket.length) {
			throw new PremisesBasketNotFoundError(`MetaId: '${meta_id}'`);
		}
		return foundBasket;
	}

	createBasketMeta(entity: CreatePremisesBasketDto) {
		const upbmEntity = this.upbRepository.create(entity);

		return this.upbRepository.save(upbmEntity);
	}
}
