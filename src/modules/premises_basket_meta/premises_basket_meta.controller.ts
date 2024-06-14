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

import { PremisesBasketMetaService } from "./premises_basket_meta.service";
import { CreatePremisesBasketMetaMetaDataDto } from "./dtos/premises_basket_meta_create.dto";

@ApiTags("premises_basket_meta")
@Controller("premises_basket_meta")
export class PremisesBasketMetaController {
	constructor(private upbmService: PremisesBasketMetaService) {}

	@Get("/")
	@HttpCode(HttpStatus.OK)
	async getAllBasketMeta(@UUIDQuery("user_id") user_id: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.upbmService.getAllBasketMeta(user_id);
		return metaData;
	}

	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async createBasketMeta(@Body() dto: CreatePremisesBasketMetaMetaDataDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const createdBasket = await this.upbmService.createBasketMeta(
			dto.data[0],
		);
		metaData.data = [createdBasket];
		return metaData;
	}
}
