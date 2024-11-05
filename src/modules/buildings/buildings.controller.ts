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
import { ApiTags } from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";

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
	constructor(private buildingsService: BuildingsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async readAll(@Query() query: FilterBuildingDto) {
		return await this.buildingsService.readAll(query);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateBuildingMetaDto) {
		const res = await this.buildingsService.create(dto.data);
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
