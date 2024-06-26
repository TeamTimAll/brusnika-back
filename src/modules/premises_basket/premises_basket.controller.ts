import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";
import { UUIDQuery } from "../../decorators";

import { CreatePremisesBasketMetaDataDto } from "./dtos/premises_basket_create.dto";
import { PremisesBasketService } from "./premises_basket.service";

@ApiTags("premises_basket")
@Controller("premises_basket")
export class PremisesBasketController {
	constructor(private upbService: PremisesBasketService) {}

	@Get("/")
	@HttpCode(HttpStatus.ACCEPTED)
	async getAllBasket(@UUIDQuery("meta_id") meta_id: string) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.upbService.getAllBasket(meta_id);
		return metaData;
	}

	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async createBasketMeta(@Body() dto: CreatePremisesBasketMetaDataDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const createdBasket = await this.upbService.createBasketMeta(
			dto.data[0],
		);
		metaData.data = [createdBasket];
		return metaData;
	}
}
