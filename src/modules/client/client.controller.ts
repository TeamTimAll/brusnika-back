import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { ClientService } from "./client.service";
import { FilterClientDto } from "./dto/client.search.dto";
import { CreateClientMetaDataDto } from "./dto/create.client.dto";

@ApiTags("Client")
@Controller("client")
export class ClientController {
	constructor(private clientService: ClientService) {}

	@Post()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async create(@Body() dto: CreateClientMetaDataDto) {
		const metaData = BaseDto.createFromDto(dto);
		metaData.data = await this.clientService.create(dto.data);
		return metaData;
	}

	@Get()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async readAll() {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.clientService.readAll();
		return metaData;
	}

	@Get("/filter")
	async readByFilter(@Query() dto: FilterClientDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.clientService.readByFilter(dto);
		return metaData;
	}
}
