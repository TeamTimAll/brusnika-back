import { ApiProperty } from "@nestjs/swagger";

export class CalculatorResponseDto {
	@ApiProperty()
	name!: string;

	@ApiProperty()
	monthly_installment!: number;
}

export class CalculatorResponseMetaDataDto {
	@ApiProperty({ type: CalculatorResponseDto })
	declare data: CalculatorResponseDto;

	desc = "### Calculator Response ma'lumotlari";
}

export class CalculatorResponseArrayMetaDataDto {
	@ApiProperty({ type: CalculatorResponseDto, isArray: true })
	declare data: CalculatorResponseDto[];

	desc = "### Calculator Response ma'lumotlari";
}
