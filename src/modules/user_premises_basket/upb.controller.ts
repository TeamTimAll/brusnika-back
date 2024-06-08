import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Uuid } from "boilerplate.polyfill";

import { BaseDto } from "../../common/base/base_dto";
import { UUIDQuery } from "../../decorators";

import { CreateUserPremisesBasketMetaDataDto } from "./dtos/upb_create.dto";
import { UPBService } from "./upb.service";

@ApiTags("user_premises_basket")
@Controller("user_premises_basket")
export class UPBController {
	constructor(private upbService: UPBService) {}

	@Get("/")
	@HttpCode(HttpStatus.ACCEPTED)
	async getAllBasket(@UUIDQuery("meta_id") meta_id: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.upbService.getAllBasket(meta_id);
		return metaData;
	}

	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async createBasketMeta(@Body() dto: CreateUserPremisesBasketMetaDataDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const createdBasket = await this.upbService.createBasketMeta(
			dto.data[0],
		);
		metaData.data = [createdBasket];
		return metaData;
	}
}
