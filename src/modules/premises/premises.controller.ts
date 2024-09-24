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
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ConfigManager } from "../../config";

import { CreatePremisesMetaDataDto } from "./dtos/CreatePremises.dto";
import { PremiseDto } from "./dtos/Premises.dto";
import { PremisesFilterDto } from "./dtos/PremisesFilter.dto";
import { PremisesIdsDto } from "./dtos/PremisesIds.dto";
import { UpdatePremisesMetaDataDto } from "./dtos/UpdatePremises.dto";
import { PremisesService } from "./premises.service";

@Controller("/premises")
@ApiTags("Premises")
@UseInterceptors(TransformInterceptor)
export class PremisesController {
	constructor(private service: PremisesService) {}

	@ApiOperation({ summary: "Create a premises " })
	@ApiResponse({ status: HttpStatus.CREATED, type: PremiseDto })
	@Post()
	async createPremises(@Body() dto: CreatePremisesMetaDataDto) {
		return await this.service.create(dto.data);
	}

	@ApiOperation({ summary: "Get all Premises" })
	@ApiResponse({ status: HttpStatus.OK, type: PremiseDto, isArray: true })
	@Get()
	async getPremises(@Query() filterDto: PremisesFilterDto) {
		return await this.service.getPremisesFiltered(filterDto);
	}

	@ApiOperation({ summary: "Get all Season" })
	@ApiResponse({ status: HttpStatus.OK, type: PremiseDto, isArray: true })
	@Get("seasons")
	async readAllSeason(@Query() filterDto: PremisesFilterDto) {
		return await this.service.readAllSeason(filterDto);
	}

	@ApiOperation({ summary: "Get a single city by ID" })
	@Get(":id")
	async getSinglePremises(@Param("id") id: number) {
		return await this.service.readOne(id);
	}

	@ApiResponse({ status: HttpStatus.OK, type: PremiseDto })
	@Get("/cherry-pick/:ids")
	async getMultiplePremisesByIds(@Query() dto: PremisesIdsDto) {
		if (!dto.ids) {
			return [];
		}

		if (typeof dto.ids === "number") {
			dto.ids = [dto.ids];
		}

		return await this.service.getMultiplePremisesByIds(
			dto.ids,
			dto.limit,
			dto.page,
		);
	}

	@ApiResponse({ status: HttpStatus.OK, type: PremiseDto })
	@Get("/link/:ids")
	createLink(@Query() dto: PremisesIdsDto) {
		const encryptionKey = ConfigManager.config.LINK_ENCRYPTION_KEY;

		if (!dto.ids) {
			dto.ids = [];
		}

		if (typeof dto.ids === "number") {
			dto.ids = [dto.ids];
		}

		const encryptedLink = this.service.createEncryptedLink(
			dto.ids,
			encryptionKey,
			dto.page,
			dto.limit,
		);

		return encryptedLink;
	}

	@ApiResponse({ status: HttpStatus.OK, type: PremiseDto })
	@Get("decrypt/:link")
	async premisesByLink(@Param("link") link: string) {
		const encryptionKey = ConfigManager.config.LINK_ENCRYPTION_KEY;

		const data = JSON.parse(
			this.service.decryptLink(
				Buffer.from(link, "base64").toString(),
				encryptionKey,
			),
		) as { ids: number[]; page: number; limit: number };

		return await this.service.getMultiplePremisesByIds(
			data.ids,
			data.limit,
			data.page,
		);
	}

	@ApiOperation({ summary: "Update a premises by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async update(
		@Param("id") id: number,
		@Body() dto: UpdatePremisesMetaDataDto,
	) {
		return await this.service.update(id, dto.data);
	}

	@ApiOperation({ summary: "Delete a premises by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async delete(@Param("id") id: number) {
		return await this.service.delete(id);
	}
}
