import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiDtoResponse } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateCallRequestMetaDataDto } from "./dto/create-call-request.dto";
import { FilterCallRequestDto } from "./dto/filter-call-request.dto";
import {
	CallRequestArrayMetaDataDto,
	CallRequestMetaDataDto,
} from "./dto/call-request.dto";
import { CallRequestService } from "./call-request.service";

@ApiTags("Call Request")
@Controller("call-request")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class CallRequestController {
	constructor(private service: CallRequestService) {}

	@Get()
	@ApiOperation({ summary: "Get all call requests" })
	@ApiDtoResponse(CallRequestArrayMetaDataDto, HttpStatus.OK)
	async readAll(@Query() dto: FilterCallRequestDto) {
		return await this.service.readAll(dto);
	}

	@Post()
	@ApiOperation({
		summary: "create call request",
		description: "### Call Request yasash",
	})
	@ApiDtoResponse(CallRequestMetaDataDto, HttpStatus.OK)
	async create(@Body() dto: CreateCallRequestMetaDataDto) {
		const res = this.service.create(dto.data);
		return res;
	}

	@Get(":id")
	@ApiOperation({ summary: "Get call requests by id" })
	@ApiDtoResponse(CallRequestMetaDataDto, HttpStatus.OK)
	async readOne(@Param("id") id: number) {
		return this.service.readOne(id);
	}

	// @Post("/change-status")
	// @ApiDtoResponse(ExchangeRequestMetaDataDto, HttpStatus.OK)
	// async changeStatus(@Query() dto: UpdateExchangeRequestStatusDto) {
	// 	const res = await this.service.changeStatus(dto.id, dto.state);

	// 	return res;
	// }
}
