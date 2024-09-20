import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { CalculatorService } from "./calculator.service";
import { GetAllBanksMetaDataDto } from "./dto/GetAllBanks.dto";

@ApiTags("Calculator")
@Controller("calculator")
@UseInterceptors(TransformInterceptor)
export class CalculatorController {
	constructor(private readonly calculatorService: CalculatorService) {}

	@Post()
	getAllBanks(@Body() dto: GetAllBanksMetaDataDto) {
		return this.calculatorService.getAllBanks(dto.data);
	}
}
