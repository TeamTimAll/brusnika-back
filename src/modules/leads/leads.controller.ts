import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { CreateLeadMetaDataDto } from "./dtos/CreateLead.dto";
import { LeadReadByFilterDto } from "./dtos/LeadReadByFilter.dto";
import { UpdateLeadDto } from "./dtos/UpdateLead.dto";
import { LeadsService } from "./leads.service";

@ApiTags("Leads")
@Controller("leads")
@UseInterceptors(TransformInterceptor)
export class LeadsController {
	constructor(private dealsService: LeadsService) {}

	@Post()
	async create(@Body() lead: CreateLeadMetaDataDto) {
		return await this.dealsService.create(lead.data);
	}

	@Post("/change-status")
	async changeStatus(@Query() dto: UpdateLeadDto) {
		return await this.dealsService.changeStatus(dto.leadId, dto.toStatus);
	}

	@Get()
	// @ApiOkResponse({ type: LeadReadAll })
	async readAll(@Query() dto: LeadReadByFilterDto) {
		return await this.dealsService.readAll(dto);
	}
}
