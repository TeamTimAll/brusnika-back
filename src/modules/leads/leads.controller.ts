import {
	Body,
	Controller,
	Get,
	Inject,
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
import { AnalyticsService } from "../analytics/analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateLeadMetaDataDto } from "./dtos/CreateLead.dto";
import { LeadReadByFilterDto } from "./dtos/LeadReadByFilter.dto";
import { UpdateLeadDto } from "./dtos/UpdateLead.dto";
import { LeadOpStatus } from "./lead_ops.entity";
import { LeadsService } from "./leads.service";

@ApiTags("Leads")
@Controller("leads")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class LeadsController {
	constructor(
		private dealsService: LeadsService,
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@Post()
	async create(
		@Body() lead: CreateLeadMetaDataDto,
		@User() user: ICurrentUser,
	) {
		const res = await this.dealsService.create(lead.data);
		await this.analyticsService.incrementCreatedCount(user.analytics_id!);
		return res;
	}

	@Post("/change-status")
	async changeStatus(@Query() dto: UpdateLeadDto) {
		const [res, count] = await this.dealsService.changeStatus(
			dto.leadId,
			dto.toStatus,
		);
		if (dto.toStatus === LeadOpStatus.WON) {
			const analytics = await this.analyticsService.createOrFind(
				res.agent_id,
			);
			await this.analyticsService.incrementSuccessLeadsCount(
				analytics.id,
			);
			await this.analyticsService.calcAvgSuccessLeadsSum(
				analytics.id,
				count,
				BigInt(res.premise.price),
			);
			await this.analyticsService.calcAvgSuccessLeadsM2(
				analytics.id,
				count,
				res.premise.size,
			);
		}
		return res;
	}

	@Get()
	// @ApiOkResponse({ type: LeadReadAll })
	async readAll(@Query() dto: LeadReadByFilterDto) {
		return await this.dealsService.readAll(dto);
	}
}
