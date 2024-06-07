import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Put,
	Post,
	Delete,
	InternalServerErrorException,
	HttpException,
	Query,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { UUIDParam } from "../../decorators";
import { CreatePremisesDto } from "./dtos/create-premises.dto";
import { PremisesDto, PremisesFilterDto } from "./dtos/premises.dto";
import { UpdatePremisesDto } from "./dtos/update-premises.dto";
import { PremisesService } from "./premises.service";
import { Uuid } from "boilerplate.polyfill";

@Controller("/premises")
@ApiTags("Premises")
export class PremisesController {
	constructor(private service: PremisesService) {}

	@ApiOperation({ summary: "Create a premises " })
	@ApiResponse({ status: HttpStatus.CREATED, type: PremisesDto })
	@Post()
	async createCity(
		@Body() createPremisesDto: CreatePremisesDto,
	): Promise<any> {
		try {
			return await this.service.create(createPremisesDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Get all Premises" })
	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto, isArray: true })
	@Get()
	async getPremises(@Query() filterDto: PremisesFilterDto): Promise<any> {
		try {
			return await this.service.getPremisesFiltered(filterDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Get unique number premises " })
	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto, isArray: true })
	@Get("/unique-number/")
	async getUniqueNumberPremises(
		@Query() filterDto: PremisesFilterDto,
	): Promise<any> {
		try {
			return await this.service.getPremisesFiltered(filterDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Get a single city by ID" })
	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto })
	@Get(":id")
	async getSingleCity(@UUIDParam("id") id: Uuid): Promise<any> {
		try {
			return await this.service.findOne(id);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Update a city by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async updateCity(
		@UUIDParam("id") id: Uuid,
		@Body() updatePremisesDto: UpdatePremisesDto,
	): Promise<any> {
		try {
			await this.service.update(id, updatePremisesDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Delete a city by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deleteCity(@UUIDParam("id") id: Uuid): Promise<any> {
		try {
			await this.service.remove(id);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	private handleException(error: any): HttpException {
		if (error.status) {
			return new HttpException(
				error.message ? error.message : error.response,
				error.status,
			);
		} else {
			console.error(error.message);
			return new InternalServerErrorException("Internal server error");
		}
	}
}
