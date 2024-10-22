import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateLeadMetaDataDto } from "./dtos/CreateLead.dto";
import { LeadReadByFilterDto } from "./dtos/LeadReadByFilter.dto";
import { UpdateLeadDto } from "./dtos/UpdateLead.dto";
import { LeadsService } from "./leads.service";

@ApiTags("Leads")
@Controller("leads")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class LeadsController {
	constructor(private dealsService: LeadsService) {}

	@Post()
	async create(@Body() lead: CreateLeadMetaDataDto) {
		const res = await this.dealsService.create(lead.data);
		return res;
	}

	@Post("/change-status")
	async changeStatus(@Query() dto: UpdateLeadDto) {
		const [res] = await this.dealsService.changeStatus(
			dto.leadId,
			dto.toStatus,
		);
		return res;
	}

	@Get()
	// @ApiOkResponse({ type: LeadReadAll })
	async readAll(
		@Query() dto: LeadReadByFilterDto,
		@User() user: ICurrentUser,
	) {
		return await this.dealsService.readAll(dto, user);
	}

	@Get(":id")
	async readOne(@Param("id") id: number) {
		return await this.dealsService.readOne(id);
	}

	@Get("view-nps/:id")
	async viewNPS(@Param("id") id: number, @User() user: ICurrentUser) {
		return await this.dealsService.viewNPS(id, user);
	}
}
