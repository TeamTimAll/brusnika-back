import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

import { ApiErrorResponse } from "../../decorators";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { CityService } from "./cities.service";
import { CreateCitiesMetaDataDto } from "./dtos/create-cities.dto";
import { UpdateCitiesMetaDataDto } from "./dtos/update-cities.dto";
import { CityNotFoundError } from "./errors/CityNotFound.error";

@ApiTags("Cities")
@Controller("/cities")
@UseInterceptors(TransformInterceptor)
export class CityController {
	constructor(private service: CityService) {}

	@ApiOperation({ summary: "Create a city" })
	@Post()
	create(@Body() dto: CreateCitiesMetaDataDto) {
		return this.service.create(dto.data);
	}

	@ApiQuery({
		name: "name",
		description: " city Name (optional if not provided  or empty)",
		required: false,
	})
	@ApiOperation({ summary: "Get all cities" })
	@Get()
	@ApiErrorResponse(CityNotFoundError, "'name' city not found")
	async getCities(@Query("name") name?: string) {
		return await this.service.readAll(name);
	}

	@ApiOperation({ summary: "Get a single city by ID" })
	@ApiErrorResponse(CityNotFoundError, "'name' city not found")
	@Get(":id")
	async getSingleCity(
		@Param("id")
		id: number,
	) {
		return await this.service.readOne(id);
	}

	@ApiOperation({ summary: "Update a city by ID" })
	@ApiErrorResponse(CityNotFoundError, "'name' city not found")
	@Put(":id")
	async updateCity(
		@Param("id") id: number,
		@Body() dto: UpdateCitiesMetaDataDto,
	) {
		return await this.service.update(id, dto.data);
	}

	@ApiOperation({ summary: "Delete a city by ID" })
	@ApiErrorResponse(CityNotFoundError, "'name' city not found")
	@Delete(":id")
	async deleteCity(@Param("id") id: number) {
		return await this.service.delete(id);
	}
}
