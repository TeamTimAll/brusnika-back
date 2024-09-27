import {
	Body,
	Controller,
	HttpStatus,
	Post,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ApiDtoResponse } from "../../decorators";

import {
	CreateMortgageRequestMetaDataDto,
	MortgageRequestMetaDataDto,
} from "./dtos";
import { MortgageRequestService } from "./mortgage-request.service";

@ApiTags("Mortgage Request")
@Controller("mortgage-request")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class MortgageRequestController {
	constructor(private service: MortgageRequestService) {}

	@ApiDtoResponse(MortgageRequestMetaDataDto, HttpStatus.OK)
	@Post()
	async create(@Body() payload: CreateMortgageRequestMetaDataDto) {
		const res = await this.service.create(payload.data);
		return res;
	}

	// @Get()
	// @ApiOkResponse({ type: LeadReadAll })
	// async readAll(@Query() dto: LeadReadByFilterDto) {
	// 	return await this.dealsService.readAll(dto);
	// }
}
