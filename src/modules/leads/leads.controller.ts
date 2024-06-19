import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { CreateLeadDto } from "./dtos/leads.create.dto";
import { LeadsService } from "./leads.service";

@ApiTags("Leads")
@Controller("leads")
export class LeadsController {
	constructor(private dealsService: LeadsService) {}

	@Post()
	async create(@Body() lead: BaseDto<CreateLeadDto>) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = [await this.dealsService.create(lead.data)];
		return metaData;
	}
}
