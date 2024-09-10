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
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { User } from "../../decorators";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { AnalyticsService } from "../analytics/analytics.service";

import { BuildingsService } from "./buildings.service";
import { CreateBuildingMetaDto } from "./dtos/CreateBuilding.dto";
import { UpdateBuildingMetaDataDto } from "./dtos/UpdateBuilding.dto";

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
	@ApiQuery({
		name: "project_id",
		required: false,
	})
	async readAll(@Query("project_id") project_id?: number) {
		return await this.buildingsService.readAll(project_id);
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
