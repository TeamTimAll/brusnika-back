import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { CreatePremisesBasketMetaMetaDataDto } from "./dtos/premises_basket_meta_create.dto";
import { PremisesBasketMetaService } from "./premises_basket_meta.service";

@ApiTags("premises_basket_meta")
@Controller("premises_basket_meta")
export class PremisesBasketMetaController {
	constructor(private upbmService: PremisesBasketMetaService) {}

	@Get("/")
	@HttpCode(HttpStatus.OK)
	async getAllBasketMeta(@Query("user_id") user_id: number) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.upbmService.getAllBasketMeta(user_id);
		return metaData;
	}

	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async createBasketMeta(@Body() dto: CreatePremisesBasketMetaMetaDataDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const createdBasket = await this.upbmService.createBasketMeta(dto.data);
		metaData.data = [createdBasket];
		return metaData;
	}
}
