import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { User } from "../../decorators";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { AnalyticsService } from "../analytics/analytics.service";

import { BuildingsService } from "./buildings.service";
import {
	FilterBuildingDto,
	CreateBuildingMetaDto,
	UpdateBuildingMetaDataDto,
} from "./dtos";

@ApiTags("Buildings")
@Controller("buildings")
@UseInterceptors(TransformInterceptor)
export class BuildingsController {
	constructor(
		private buildingsService: BuildingsService,
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async readAll(@Query() query: FilterBuildingDto) {
		return await this.buildingsService.readAll(query);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() dto: CreateBuildingMetaDto,
		@User() user: ICurrentUser,
	) {
		const res = await this.buildingsService.create(dto.data);
		await this.analyticsService.incrementCreatedCount(user.analytics_id!);
		return res;
	}

	@Put(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Body() dto: UpdateBuildingMetaDataDto,
		@Param("id") id: number,
	) {
		return await this.buildingsService.update(id, dto.data);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id") id: number) {
		return await this.buildingsService.delete(id);
	}
}
