import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	ParseArrayPipe,
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

import { BaseDto } from "../../common/base/base_dto";
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
	async createPremises(@Body() createPremisesDto: CreatePremisesDto) {
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
	@Get(":id")
	async getSinglePremises(@UUIDParam("id") id: string) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.readOne(id);
		return metaData;
	}

	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto })
	@Get("/cherry-pick/:ids")
	async getMultiplePremisesByIds(
		@Query("ids", new ParseArrayPipe({ optional: true }))
		ids: string[],
	) {
		if (!ids || !ids.length) {
			return [];
		}
		/*
			If the query id is single, the @Query decorator returns a string.
 			We need to check if it is a string or not. Because getMultiplePremisesByIds
			function accepts array of strings.
		*/
		if (typeof ids === "string") {
			ids = [ids];
		}
		return await this.service.getMultiplePremisesByIds(ids);
	}

	@ApiOperation({ summary: "Update a premises by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async updatePremises(
		@UUIDParam("id") id: string,
		@Body() updatePremisesDto: UpdatePremisesDto,
	) {
		await this.service.update(id, updatePremisesDto);
	}

	@ApiOperation({ summary: "Delete a premises by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deletePremises(@UUIDParam("id") id: string) {
		await this.service.remove(id);
	}
}
