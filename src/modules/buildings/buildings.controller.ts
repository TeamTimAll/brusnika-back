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
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { BuildingsService } from "./buildings.service";
import { CreateBuildingMetaDto } from "./dtos/building.create.dto";
import {
	UpdateBuilding,
	UpdateBuildingMetaDataDto,
} from "./dtos/building.update.dto";

@ApiTags("Buildings")
@Controller("buildings")
export class BuildingsController {
	constructor(private buildingsService: BuildingsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiQuery({
		name: "project_id",
		required: false,
	})
	async getAll(@Query("project_id") project_id?: number) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.buildingsService.findAllBuilding(project_id);
		return metaData;
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateBuildingMetaDto) {
		const metaData = BaseDto.createFromDto(dto);
		const createdBuilding = await this.buildingsService.createBuilding(
			dto.data,
		);
		metaData.data = createdBuilding;
		return metaData;
	}

	@Put(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Body() dto: UpdateBuildingMetaDataDto,
		@Param("id") id: number,
	) {
		const metaData = BaseDto.createFromDto(dto);
		const updatedBuilding = await this.buildingsService.updateBuilding(
			id,
			dto.data,
		);
		metaData.data = updatedBuilding as UpdateBuilding;
		return metaData;
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id") id: number) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const deletedBuilding = await this.buildingsService.delete(id);
		metaData.data = deletedBuilding;
		return metaData;
	}
}
