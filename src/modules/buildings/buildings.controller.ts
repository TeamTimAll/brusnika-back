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
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Uuid } from "boilerplate.polyfill";

import { BaseDto } from "../../common/base/base_dto";
import { CreateBuildingMetaDto } from "../buildings/dtos/building.create.dto";
import { UpdateBuildingMetaDataDto } from "../buildings/dtos/building.update.dto";

import { BuildingsService } from "./buildings.service";

@ApiTags("Buildings")
@Controller("buildings")
export class BuildingsController {
	constructor(private buildingsService: BuildingsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getAll(@Query("project_id") project_id: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.buildingsService.findAllBuilding(project_id);
		return metaData;
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateBuildingMetaDto) {
		const metaData = BaseDto.createFromDto(dto);
		const createdBuilding = await this.buildingsService.createBuilding(
			dto.data[0],
		);
		metaData.data = [createdBuilding];
		return metaData;
	}

	@Put(":id")
	@HttpCode(HttpStatus.OK)
	async update(@Body() dto: UpdateBuildingMetaDataDto) {
		const metaData = BaseDto.createFromDto(dto);
		const updatedBuilding = await this.buildingsService.updateBuilding(
			dto.meta.params.id,
			dto.data[0],
		);
		metaData.data = [updatedBuilding];
		return metaData;
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id") id: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const deletedBuilding = await this.buildingsService.delete(id);
		metaData.data = [deletedBuilding];
		return metaData;
	}
}
