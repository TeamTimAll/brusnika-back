import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
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

import { CreatePremisesDto } from "./dtos/create-premises.dto";
import {
	PremisesDto,
	PremisesFilterDto,
	PremisesIdsDto,
} from "./dtos/premises.dto";
import { UpdatePremisesDto } from "./dtos/update-premises.dto";
import { PremisesEntity } from "./premises.entity";
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
		const metaData = BaseDto.createFromDto(new BaseDto<PremisesEntity[]>());
		const response = await this.service.getPremisesFiltered(filterDto);
		metaData.setLinks(response.links);
		metaData.data = response.data;
		return metaData;
	}

	@ApiOperation({ summary: "Get a single city by ID" })
	@Get(":id")
	async getSinglePremises(@Param("id") id: number) {
		const metaData = BaseDto.createFromDto<BaseDto, PremisesEntity>(
			new BaseDto(),
		);
		metaData.data = await this.service.readOne(id);
		return metaData;
	}

	@ApiResponse({ status: HttpStatus.OK, type: PremisesDto })
	@Get("/cherry-pick/:ids")
	async getMultiplePremisesByIds(@Query() dto: PremisesIdsDto) {
		const metaData = BaseDto.createFromDto(new BaseDto<PremisesEntity[]>());
		if (!dto.ids) {
			metaData.data = [];
			return metaData;
		}
		/*
			If the query id is single, the @Query decorator returns a string.
 			We need to check if it is a string or not. Because getMultiplePremisesByIds
			function accepts array of strings.
		*/
		if (typeof dto.ids === "number") {
			dto.ids = [dto.ids];
		}
		const response = await this.service.getMultiplePremisesByIds(
			dto.ids,
			dto.limit,
			dto.page,
		);
		metaData.setLinks(response.links);
		metaData.data = response.data;
		return metaData;
	}

	@ApiOperation({ summary: "Update a premises by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async updatePremises(
		@Param("id") id: number,
		@Body() updatePremisesDto: UpdatePremisesDto,
	) {
		await this.service.update(id, updatePremisesDto);
	}

	@ApiOperation({ summary: "Delete a premises by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deletePremises(@Param("id") id: number) {
		await this.service.remove(id);
	}
}
