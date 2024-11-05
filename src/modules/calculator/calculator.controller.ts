import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { CalculatorService } from "./calculator.service";
import {
	CalculatorResponseArrayMetaDataDto,
	GetAllBanksMetaDataDto,
} from "./dto";

@ApiTags("Calculator")
@Controller("calculator")
@UseInterceptors(TransformInterceptor)
export class CalculatorController {
	constructor(private readonly calculatorService: CalculatorService) {}

	@ApiOkResponse({ type: CalculatorResponseArrayMetaDataDto })
	@Post()
	getAllBanks(@Body() dto: GetAllBanksMetaDataDto) {
		return this.calculatorService.getAllBanks(dto.data);
	}
}
