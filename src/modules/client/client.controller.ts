import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";
import { createLink } from "../../lib/pagination";

import { ClientService } from "./client.service";
import { FilterClientDto, ClientQuickSearchDto } from "./dto/client.search.dto";
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

	@Get("/search")
	async quickSearch(@Query() dto: ClientQuickSearchDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.clientService.quickSearch(dto.fullname);
		return metaData;
	}

	@Get()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async readAll(@Query() dto: FilterClientDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const serviceResponse = await this.clientService.readAll(dto);
		metaData.data = serviceResponse.data;
		metaData.meta.links = createLink(serviceResponse.links);
		return metaData;
	}
}
