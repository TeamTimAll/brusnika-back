import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Post,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { RoleType } from "../../constants";
import { User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { AnalyticsService } from "../analytics/analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { ClientService } from "./client.service";
import { ClientQuickSearchDto } from "./dto/ClientQuickSearch.dto";
import { ClientSearchFromBmpsoftDto } from "./dto/ClientSearchFromBmpsoft.dto";
import { CreateClientMetaDataDto } from "./dto/CreateClient.dto";
import { DeleteClientDto } from "./dto/DeleteClient.dto";
import { FilterClientDto } from "./dto/FilterClient.dto";

@ApiTags("Client")
@Controller("client")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class ClientController {
	constructor(
		private clientService: ClientService,
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@Post()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async create(
		@User() user: ICurrentUser,
		@Body() dto: CreateClientMetaDataDto,
	) {
		dto.data.agent_id = user.user_id;
		const res = await this.clientService.create(dto.data);
		await this.analyticsService.incrementCreatedCount(user.analytics_id!);
		await this.analyticsService.incrementClientCount(user.analytics_id!);
		return res;
	}

	@Get("/search")
	async quickSearch(
		@User() user: ICurrentUser,
		@Query() dto: ClientQuickSearchDto,
	) {
		return await this.clientService.quickSearch(dto.text, user);
	}

	@Roles([
		RoleType.ADMIN,
		RoleType.AGENT,
		RoleType.MANAGER,
		RoleType.HEAD_OF_AGENCY,
		RoleType.AFFILIATE_MANAGER,
	])
	@Get()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async readAll(@User() user: ICurrentUser, @Query() dto: FilterClientDto) {
		return await this.clientService.readAll(dto, user);
	}

	@Get("/search-from-bmpsoft")
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async searchFromBmpsoft(
		@User() user: ICurrentUser,
		@Query() dto: ClientSearchFromBmpsoftDto,
	) {
		return await this.clientService.searchFromBmpsoft(dto, user);
	}

	@Delete()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async delete(@User() user: ICurrentUser, @Query() dto: DeleteClientDto) {
		return await this.clientService.delete(dto, user);
	}
}
