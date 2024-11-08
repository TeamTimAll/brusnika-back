import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RoleType } from "../../constants";
import { ApiErrorResponse } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { ApartmentImageService } from "./apartment-image.service";
import {
	ApartmentImagesMetaDataDto,
	ApartmentImageMetaDataDto,
} from "./dto/Banner.dto";
import { CreateApartmentImageMetaDataDto } from "./dto/create-apartment-image.dto";
import { ApartmentImageFoundError } from "./errors/ApartmentImageNotFound.error";

@ApiTags("Apartment Image")
@Controller("apartment-image")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class ApartmentImageController {
	constructor(private readonly service: ApartmentImageService) {}

	@Roles([RoleType.ADMIN])
	@Post()
	@ApiResponse({ type: ApartmentImageMetaDataDto })
	async create(@Body() dto: CreateApartmentImageMetaDataDto) {
		return this.service.create(dto.data);
	}

	@Get()
	@ApiResponse({ type: ApartmentImagesMetaDataDto })
	async readAll() {
		return this.service.readAll();
	}

	@Get(":id")
	@ApiErrorResponse(ApartmentImageFoundError, "id: 'id'")
	@ApiResponse({ type: ApartmentImageMetaDataDto })
	async readOne(@Param("id") id: number) {
		return this.service.readOne(id);
	}

	@Roles([RoleType.ADMIN])
	@Delete(":id")
	@ApiErrorResponse(ApartmentImageFoundError, "id: 'id'")
	@ApiResponse({ type: ApartmentImageMetaDataDto })
	async delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
