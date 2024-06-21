import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { CreateLeadMetaDataDto } from "./dtos/leads.create.dto";
import { LeadsService } from "./leads.service";
import { LeadReadAll } from "./dtos/leads.dto";

@ApiTags("Leads")
@Controller("leads")
export class LeadsController {
	constructor(private dealsService: LeadsService) {}

	@Post()
	async create(@Body() lead: CreateLeadMetaDataDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.dealsService.create(lead.data);
		return metaData;
	}

	@Get()
	@ApiOkResponse({ type: LeadReadAll })
	async readAll() {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.dealsService.readAll();
		return metaData;
	}
}
