import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ApiErrorResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { AnalyticsService } from "../analytics/analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CityService } from "./cities.service";
import { CreateCitiesMetaDataDto } from "./dtos/CreateCities.dto";
import { UpdateCitiesMetaDataDto } from "./dtos/UpdateCities.dto";
import { CityNotFoundError } from "./errors/CityNotFound.error";

@ApiTags("Cities")
@Controller("/cities")
@UseInterceptors(TransformInterceptor)
export class CityController {
	constructor(
		private service: CityService,
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@ApiOperation({ summary: "Create a city" })
	@Post()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	async create(
		@Body() dto: CreateCitiesMetaDataDto,
		@User() user: ICurrentUser,
	) {
		const res = this.service.create(dto.data);
		await this.analyticsService.incrementCreatedCount(user.analytics_id!);
		return res;
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
