import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { CitiesService } from "./cities.service";
import { CreateCitiesMetaDataDto } from "./dtos/create-cities.dto";
import { UpdateCitiesMetaDataDto } from "./dtos/update-cities.dto";
import { CityNotFoundError } from "./errors/CityNotFound.error";

@ApiTags("Cities")
@Controller("/cities")
export class CitiesController {
	constructor(private service: CitiesService) {}

	// -------------------------------@Post()-----------------------------------
	@ApiOperation({ summary: "Create a city" })
	@Post()
	createCity(@Body() createCitiesDto: CreateCitiesMetaDataDto) {
		const dto = createCitiesDto.data;
		return this.service.create(dto);
	}
	// ------------------------------@Get()-------------------------------------

	@ApiQuery({
		name: "name",
		description: " city Name (optional if not provided  or empty)",
		required: false,
	})
	@ApiOperation({ summary: "Get all cities" })
	@Get()
	@ApiResponse({
		status: new CityNotFoundError().status,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
				new CityNotFoundError("'name' city not found"),
			),
		},
	})
	async getCities(@Query("name") name: string) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		if (name && name.length) {
			metaData.data = await this.service.findAllWithName(name);
			return metaData;
		} else {
			metaData.data = await this.service.r_findAll();
			return metaData;
		}
	}
	// ----------------------------@Get(":id")----------------------------------
	@ApiOperation({ summary: "Get a single city by ID" })
	@ApiResponse({
		status: new CityNotFoundError().status,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
				new CityNotFoundError("'name' city not found"),
			),
		},
	})
	@Get(":id")
	async getSingleCity(
		@Param("id")
		id: number,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const foundCity = await this.service.r_findOne(id);
		metaData.data = foundCity;
		return metaData;
	}
	// ---------------------------@Put(":id")-----------------------------------
	@ApiOperation({ summary: "Update a city by ID" })
	@Put(":id")
	async updateCity(
		@Param("id") id: number,
		@Body() updateCitiesDto: UpdateCitiesMetaDataDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const dto = updateCitiesDto.data;
		const updatedCity = await this.service.r_update(id, dto);
		metaData.data = updatedCity;
		return metaData;
	}
	// ---------------------------@Delete(":id")-------------------------------
	@ApiOperation({ summary: "Delete a city by ID" })
	@Delete(":id")
	async deleteCity(@Param("id") id: number) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.r_remove(id);
		return metaData;
	}
	// -----------------------------------------------------------------------
}
