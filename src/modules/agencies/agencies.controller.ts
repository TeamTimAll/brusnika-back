import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ApiDtoResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { AgencyEntity } from "./agencies.entity";
import { AgencyService } from "./agencies.service";
import { AgenciesDto } from "./dtos/Agencies.dto";
import { CreateAgenciesMetaDataDto } from "./dtos/CreateAgencies.dto";
import { UpdateAgenciesMetaDataDto } from "./dtos/UpdateAgencies.dto";

@ApiTags("Agencies")
@Controller("/agencies")
@UseInterceptors(TransformInterceptor)
export class AgencyController {
	constructor(private service: AgencyService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: AgenciesDto })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	async create(
		@Body() dto: CreateAgenciesMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.service.create(dto.data, user);
	}

	@Get()
	@ApiQuery({
		name: "name",
		description: " Agencies Name (optional if not provided  or empty)",
		required: false,
	})
	@ApiDtoResponse(AgenciesDto, HttpStatus.OK)
	async readAll(@Query("name") name?: string): Promise<AgencyEntity[]> {
		return this.service.readAll(name);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: AgenciesDto })
	async readOne(@Param("id") id: number): Promise<AgencyEntity> {
		return await this.service.readOne(id);
	}

	@Put(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	update(
		@Param("id") id: number,
		@Body() dto: UpdateAgenciesMetaDataDto,
	): Promise<AgencyEntity> {
		return this.service.update(id, dto.data);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	async delete(@Param("id") id: number): Promise<AgencyEntity> {
		return await this.service.delete(id);
	}
}
