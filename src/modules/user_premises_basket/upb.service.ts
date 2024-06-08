import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Uuid } from "boilerplate.polyfill";

import { UserPremisesBasketNotFoundError } from "./errors/UPBNotFound.error";
import { UserPremisesBasketEntity } from "./upb.entity";
import { CreateUserPremisesBasketDto } from "./dtos/upb_create.dto";

@Injectable()
export class UPBService {
	constructor(
		@InjectRepository(UserPremisesBasketEntity)
		private upbRepository: Repository<UserPremisesBasketEntity>,
	) {}

	async getAllBasket(meta_id: Uuid) {
		const foundBasket = await this.upbRepository.find({
			where: { meta: { id: meta_id } },
		});
		if (!foundBasket.length) {
			throw new UserPremisesBasketNotFoundError(`MetaId: '${meta_id}'`);
		}
		return foundBasket;
	}

	createBasketMeta(entity: CreateUserPremisesBasketDto) {
		const upbmEntity = this.upbRepository.create(entity);

		return this.upbRepository.save(upbmEntity);
	}
}
