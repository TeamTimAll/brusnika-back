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
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RoleType } from "../../constants";
import { ApiErrorResponse } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CityNotFoundError } from "../cities/errors/CityNotFound.error";

import { BannerService } from "./banner.service";
import { BannerArrayMetaDataDto, BannerMetaDataDto } from "./dto/Banner.dto";
import { BannerFilterDto } from "./dto/BannerFilter.dto";
import { BulkBannerMetaDataDto } from "./dto/BulkBanner.dto";
import { CreateBannerMetaDataDto } from "./dto/CreateBanner.dto";
import { UpdateBannerMetaDataDto } from "./dto/UpdateBanner.dto";
import { BannerNotFoundError } from "./errors/BannerNotFound.error";

@ApiTags("Banner")
@Controller("banner")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post()
	@ApiErrorResponse(CityNotFoundError, "id: 'id'")
	@ApiResponse({ type: BannerMetaDataDto })
	async create(@Body() dto: CreateBannerMetaDataDto) {
		return this.bannerService.create(dto.data);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post("bulk")
	@ApiErrorResponse(CityNotFoundError, "id: 'id'")
	@ApiResponse({ type: BannerMetaDataDto })
	async bulk(@Body() dto: BulkBannerMetaDataDto) {
		return this.bannerService.bulk(dto.data);
	}

	@Get()
	@ApiResponse({ type: BannerArrayMetaDataDto })
	async readAll(@Query() dto: BannerFilterDto) {
		return this.bannerService.readAllWithCities(dto);
	}

	@Get(":id")
	@ApiErrorResponse(BannerNotFoundError, "id: 'id'")
	@ApiResponse({ type: BannerMetaDataDto })
	async readOne(@Param("id") id: number) {
		return this.bannerService.readOne(id);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Put(":id")
	@ApiErrorResponse(BannerNotFoundError, "id: 'id'")
	@ApiResponse({ type: BannerMetaDataDto })
	async update(
		@Param("id") id: number,
		@Body() dto: UpdateBannerMetaDataDto,
	) {
		return this.bannerService.update(id, dto.data);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Delete(":id")
	@ApiErrorResponse(BannerNotFoundError, "id: 'id'")
	@ApiResponse({ type: BannerMetaDataDto })
	async delete(@Param("id") id: number) {
		return this.bannerService.delete(id);
	}
}
