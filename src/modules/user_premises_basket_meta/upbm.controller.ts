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

import { UPBMService } from "./upbm.service";
import { CreateUPBMMetaDataDto } from "./dtos/upbm_create.dto";

@ApiTags("user_premises_basket_meta")
@Controller("user_premises_basket_meta")
export class UPBController {
	constructor(private upbmService: UPBMService) {}

	@Get("/")
	@HttpCode(HttpStatus.OK)
	async getAllBasketMeta(@UUIDQuery("user_id") user_id: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.upbmService.getAllBasketMeta(user_id);
		return metaData;
	}

	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async createBasketMeta(@Body() dto: CreateUPBMMetaDataDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const createdBasket = await this.upbmService.createBasketMeta(
			dto.data[0],
		);
		metaData.data = [createdBasket];
		return metaData;
	}
}
