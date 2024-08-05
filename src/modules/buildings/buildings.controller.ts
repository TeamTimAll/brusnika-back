import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { BuildingsService } from "./buildings.service";
import { CreateBuildingMetaDto } from "./dtos/CreateBuilding.dto";
import { UpdateBuildingMetaDataDto } from "./dtos/UpdateBuilding.dto";

@ApiTags("Buildings")
@Controller("buildings")
@UseInterceptors(TransformInterceptor)
export class BuildingsController {
	constructor(private buildingsService: BuildingsService) {}

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
	async create(@Body() dto: CreateBuildingMetaDto) {
		return await this.buildingsService.create(dto.data);
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
