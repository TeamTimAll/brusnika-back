import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	// Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiDtoResponse } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateExchangeRequestMetaDataDto } from "./dto/create-exchange-request.dto";
// import { FilterExchangeRequestDto } from "./dto/filter-exchange-request.dto";
import {
	ExchangeRequestArrayMetaDataDto,
	ExchangeRequestMetaDataDto,
} from "./dto/exchange-request.dto";
import { ExchangeRequestService } from "./exchange-request.service";

@ApiTags("EXchange Request")
@Controller("exchange-request")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class ExchangeRequestController {
	constructor(private service: ExchangeRequestService) {}

	@Get()
	@ApiOperation({ summary: "Get all exchange requests" })
	@ApiDtoResponse(ExchangeRequestArrayMetaDataDto, HttpStatus.OK)
	// async readAll(@Query() dto: FilterExchangeRequestDto) {
	async readAll() {
		return await this.service.readAll();
	}

	@Post()
	@ApiOperation({
		summary: "create exchange request",
		description: "### Exchange Request yasash",
	})
	@ApiDtoResponse(ExchangeRequestMetaDataDto, HttpStatus.OK)
	async create(@Body() dto: CreateExchangeRequestMetaDataDto) {
		const res = this.service.create(dto.data);
		return res;
	}

	@Get(":id")
	@ApiOperation({ summary: "Get exchange requests by id" })
	@ApiDtoResponse(ExchangeRequestMetaDataDto, HttpStatus.OK)
	async readOne(@Param("id") id: number) {
		return this.service.readOne(id);
	}
}
