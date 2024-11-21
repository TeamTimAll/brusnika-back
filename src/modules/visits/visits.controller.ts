import {
	Body,
	Controller,
	Delete,
	Get,
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

import { ApiErrorResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateVisitsMetaDataDto } from "./dtos/CreateVisits.dto";
import { UpdateVisitsMetaDataDto } from "./dtos/UpdateVisits.dto";
import { VisitNotFoundError } from "./errors/VisitsNotFound.error";
import { VisitsService } from "./visits.service";
import { TimeSlotDto } from "./dtos/time-slot.dto";

@ApiTags("Visits")
@Controller("/visits")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class VisitsController {
	constructor(private service: VisitsService) {}

	@ApiOperation({ summary: "Create a visit" })
	@Post()
	async create(
		@User() user: ICurrentUser,
		@Body() dto: CreateVisitsMetaDataDto,
	) {
		dto.data.agent_id = user.user_id;
		const res = this.service.create(dto.data);
		return res;
	}

	@ApiQuery({
		name: "name",
		description: " visit Name (optional if not provided  or empty)",
		required: false,
	})
	@ApiOperation({ summary: "Get all visits" })
	@Get()
	@ApiErrorResponse(VisitNotFoundError, "'name' visit not found")
	async getVisits(@User() user: ICurrentUser, @Query("name") _name: string) {
		return await this.service.readAll(user);
	}

	@Get("time-slots")
	async getTimeSlots(@Query() query: TimeSlotDto) {
		return await this.service.getTimeSlots(query);
	}

	@ApiOperation({ summary: "Get a single visit by ID" })
	@ApiErrorResponse(VisitNotFoundError, "'name' visit not found")
	@Get(":id")
	async getSingleCity(
		@Param("id")
		id: number,
	) {
		return await this.service.readOne(id);
	}

	@ApiOperation({ summary: "Update a visit by ID" })
	@Put(":id")
	async updateCity(
		@Param("id") id: number,
		@Body() dto: UpdateVisitsMetaDataDto,
	) {
		return await this.service.update(id, dto.data);
	}

	@ApiOperation({ summary: "Delete a visit by ID" })
	@Delete(":id")
	async deleteCity(@Param("id") id: number) {
		return await this.service.delete(id);
	}
}
