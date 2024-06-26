import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { Uuid } from "boilerplate.polyfill";

import { BaseDto } from "../../common/base/base_dto";
import { UUIDParam, User } from "../../decorators";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ICurrentUser } from "../../interfaces/current-user.interface";

import { VisitsEntity } from "./visits.entity";
import { VisitsService } from "./visits.service";
import { CreateVisitsMetaDataDto } from "./dtos/create-visits.dto";
import { UpdateVisitsMetaDataDto } from "./dtos/update-visits.dto";
import { VisitNotFoundError } from "./errors/VisitsNotFound.error";

@ApiTags("Visits")
@Controller("/visits")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class VisitsController {
	constructor(private service: VisitsService) {}

	// -------------------------------@Post()-----------------------------------
	@ApiOperation({ summary: "Create a visit" })
	@ApiResponse({
		status: HttpStatus.CREATED,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto(),
				VisitsEntity.toDto({}),
			),
		},
	})
	@Post()
	createCity(
		@User() user: ICurrentUser,
		@Body() createVisitsDto: CreateVisitsMetaDataDto,
	) {
		const dto = createVisitsDto.data;
		dto.agent_id = user.user_id;
		return this.service.create(dto);
	}
	// ------------------------------@Get()-------------------------------------

	@ApiQuery({
		name: "name",
		description: " visit Name (optional if not provided  or empty)",
		required: false,
	})
	@ApiOperation({ summary: "Get all visits" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(new BaseDto(), [
				VisitsEntity.toDto({}),
			]),
		},
	})
	@Get()
	@ApiResponse({
		status: new VisitNotFoundError().status,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
				new VisitNotFoundError("'name' visit not found"),
			),
		},
	})
	async getVisits(@User() user: ICurrentUser, @Query("name") _name: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());

		metaData.data = await this.service.new_findAll(user);
		return metaData;
	}
	// ----------------------------@Get(":id")----------------------------------
	@ApiOperation({ summary: "Get a single visit by ID" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto(),
				VisitsEntity.toDto({}),
			),
		},
	})
	@ApiResponse({
		status: new VisitNotFoundError().status,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
				new VisitNotFoundError("'name' visit not found"),
			),
		},
	})
	@Get(":id")
	async getSingleCity(
		@UUIDParam("id")
		id: Uuid,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const foundCity = await this.service.r_findOne(id);
		metaData.data = foundCity;
		return metaData;
	}
	// ---------------------------@Put(":id")-----------------------------------
	@ApiOperation({ summary: "Update a visit by ID" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto<VisitsEntity>(),
				VisitsEntity.toDto({}),
			),
		},
	})
	@Put(":id")
	async updateCity(
		@UUIDParam("id") id: Uuid,
		@Body() updateVisitsDto: UpdateVisitsMetaDataDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const dto = updateVisitsDto.data;
		const updatedCity = await this.service.r_update(id, dto);
		metaData.data = updatedCity;
		return metaData;
	}
	// ---------------------------@Delete(":id")-------------------------------
	@ApiOperation({ summary: "Delete a visit by ID" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto(),
				VisitsEntity.toDto({}),
			),
		},
	})
	@Delete(":id")
	async deleteCity(@UUIDParam("id") id: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.r_remove(id);
		return metaData;
	}
	// -----------------------------------------------------------------------
}
