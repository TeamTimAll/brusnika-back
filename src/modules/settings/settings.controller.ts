import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Inject,
	Put,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { RoleType } from "../../constants";
import { ApiDtoResponse } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { SettingsMetaDataDto } from "./dto/Settings.dto";
import { UpdateSettingsMetaDataDto } from "./dto/UpdateSettings.dto";
import { SettingsEntity } from "./settings.entity";
import { SettingsService } from "./settings.service";

@ApiTags("Settings")
@Controller("settings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class SettingsController {
	constructor(
		@Inject()
		private readonly settingsService: SettingsService,
	) {}

	@Roles([RoleType.ADMIN])
	@Get()
	@ApiOperation({ summary: "Get settings" })
	@ApiDtoResponse(SettingsMetaDataDto, HttpStatus.OK)
	async read(): Promise<SettingsEntity> {
		return this.settingsService.read();
	}

	@Roles([RoleType.ADMIN])
	@Put()
	@ApiOperation({ summary: "Update settings" })
	@ApiDtoResponse(SettingsMetaDataDto, HttpStatus.OK)
	async update(@Body() dto: UpdateSettingsMetaDataDto) {
		return this.settingsService.update(dto.data);
	}
}
