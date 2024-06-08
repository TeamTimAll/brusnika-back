import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Uuid } from "boilerplate.polyfill";

import { CreateUPBMDto } from "./dtos/upbm_create.dto";
import { UPBMNotFoundError } from "./errors/UPBMNotFound.error";
import { UserPremisesBasketMetaEntity } from "./upbm.entity";

@Injectable()
export class UPBMService {
	constructor(
		@InjectRepository(UserPremisesBasketMetaEntity)
		private upbmRepository: Repository<UserPremisesBasketMetaEntity>,
	) {}

	async getAllBasketMeta(user_id: Uuid) {
		const foundBasket = await this.upbmRepository.find({
			where: { user: { id: user_id } },
		});
		if (!foundBasket.length) {
			throw new UPBMNotFoundError(`UserId: '${user_id}'`);
		}
		return foundBasket;
	}

	createBasketMeta(entity: CreateUPBMDto) {
		const upbmEntity = this.upbmRepository.create(entity);

		return this.upbmRepository.save(upbmEntity);
	}
}
