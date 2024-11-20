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
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ApiDtoResponse, ApiErrorResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CityNotFoundError } from "../cities/errors/CityNotFound.error";

import { AgencyEntity } from "./agencies.entity";
import { AgencyService } from "./agencies.service";
import { AgencyArrayMetaDataDto, AgencyMetaDataDto } from "./dtos/Agencies.dto";
import { CreateAgenciesMetaDataDto } from "./dtos/CreateAgencies.dto";
import { UpdateAgenciesMetaDataDto } from "./dtos/UpdateAgencies.dto";

@ApiTags("Agencies")
@Controller("/agencies")
@UseInterceptors(TransformInterceptor)
export class AgencyController {
	constructor(private service: AgencyService) {}

	@Post()
	@ApiOperation({
		description: `### Agency yasash.
		\n Ruxsat etilgan foydalanuvchilar rollari - *Hammasi*
		\n Json body haqida qisqacha:
		\n - **title** - sarlavhasi
		\n - **city_id** - shahar id'si
		\n - **legalName** - qonuniy nomi
		\n - **inn** - INN
		\n - **phone** - telefon raqami
		\n - **email** - email
		\n - **ownerFullName** - egasini to'liq F.I.SH'i
		\n - **ownerPhone** - egasini telefon raqami
		\n - **entry_doc** - dokumenti
		\n - **company_card_doc** - korxona karta raqami dokumenti
		\n - **tax_registration_doc** - soliq ro'yxatidan o'tkazish dokumenti
		\n - **authority_signatory_doc** - vakolatli organ imzolagan hujjat dokumenti`,
	})
	@ApiDtoResponse(AgencyMetaDataDto, HttpStatus.CREATED)
	@ApiErrorResponse(CityNotFoundError, "'id' city not found")
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	async create(
		@Body() dto: CreateAgenciesMetaDataDto,
		@User() user: ICurrentUser,
	) {
		const res = await this.service.create(dto.data, user);
		return res;
	}

	@Get()
	@ApiQuery({
		name: "name",
		description: " Agencies Name (optional if not provided  or empty)",
		required: false,
	})
	@ApiDtoResponse(AgencyArrayMetaDataDto, HttpStatus.OK)
	async readAll(@Query("name") name?: string): Promise<AgencyEntity[]> {
		return this.service.readAll(name);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiDtoResponse(AgencyMetaDataDto, HttpStatus.OK)
	async readOne(@Param("id") id: number): Promise<AgencyEntity> {
		return await this.service.readOne(id);
	}

	@Put(":id")
	@ApiDtoResponse(AgencyMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(CityNotFoundError, "'id' city not found")
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	update(
		@Param("id") id: number,
		@Body() dto: UpdateAgenciesMetaDataDto,
	): Promise<AgencyEntity> {
		return this.service.update(id, dto.data);
	}

	@Delete(":id")
	@ApiDtoResponse(AgencyMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(CityNotFoundError, "'id' city not found")
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	async delete(@Param("id") id: number): Promise<AgencyEntity> {
		return await this.service.delete(id);
	}

	@Post("sync")
	@ApiDtoResponse(AgencyArrayMetaDataDto, HttpStatus.OK)
	sync(@Query("password") password: string) {
		if (password === "sync1234") {
			return this.service.sync();
		}
		return [];
	}
}
