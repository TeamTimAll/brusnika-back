import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { CreateLeadMetaDataDto } from "./dtos/leads.create.dto";
import { LeadReadByFilter } from "./dtos/leads.dto";
import { UpdateLeadDto } from "./dtos/leads.update.dto";
import { LeadsService } from "./leads.service";

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

	@Post("/change-status")
	async changeStatus(@Query() dto: UpdateLeadDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.dealsService.changeStatus(
			dto.leadId,
			dto.toStatus,
		);
		return metaData;
	}

	@Get()
	// @ApiOkResponse({ type: LeadReadAll })
	async readAll(@Query() dto: LeadReadByFilter) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.dealsService.readAll(dto);
		return metaData;
	}
}
