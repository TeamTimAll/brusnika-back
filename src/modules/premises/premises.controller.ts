import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { Uuid } from "boilerplate.polyfill";

import { UUIDParam } from "../../decorators";

import { CreatePremisesDto } from "./dtos/create-premises.dto";
import { PremisesDto, PremisesFilterDto } from "./dtos/premises.dto";
import { UpdatePremisesDto } from "./dtos/update-premises.dto";
import { PremisesService } from "./premises.service";

@Controller("/premises")
@ApiTags("Premises")
export class PremisesController {
	constructor(private service: PremisesService) {}

	@ApiOperation({ summary: "Create a premises " })
	@ApiResponse({ status: HttpStatus.CREATED, type: PremisesDto })
	@Post()
	async createCity(@Body() createPremisesDto: CreatePremisesDto) {
		return await this.service.create(createPremisesDto);
	}

	@ApiOperation({ summary: "Get all Premises" })
	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto, isArray: true })
	@Get()
	async getPremises(@Query() filterDto: PremisesFilterDto) {
		return await this.service.getPremisesFiltered(filterDto);
	}

	@ApiOperation({ summary: "Get unique number premises " })
	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto, isArray: true })
	@Get("/unique-number/")
	async getUniqueNumberPremises(@Query() filterDto: PremisesFilterDto) {
		return await this.service.getPremisesFiltered(filterDto);
	}

	@ApiOperation({ summary: "Get a single city by ID" })
	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto })
	@Get(":id")
	async getSingleCity(@UUIDParam("id") id: Uuid) {
		return await this.service.findOne(id);
	}

	@ApiOperation({ summary: "Update a city by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async updateCity(
		@UUIDParam("id") id: Uuid,
		@Body() updatePremisesDto: UpdatePremisesDto,
	) {
		await this.service.update(id, updatePremisesDto);
	}

	@ApiOperation({ summary: "Delete a city by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deleteCity(@UUIDParam("id") id: Uuid) {
		await this.service.remove(id);
	}
}
