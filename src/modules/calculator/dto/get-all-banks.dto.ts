import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class GetAllBanksDto {
	@ApiProperty({ default: 0 })
	@IsNumber()
	@IsNotEmpty()
	premise_price!: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	ipoteka_time!: number;

	@ApiProperty({ default: 0 })
	@IsNumber()
	@IsNotEmpty()
	initial_payment!: number;
}

export class GetAllBanksMetaDataDto extends BaseDto<GetAllBanksDto> {
	@ApiProperty({ type: GetAllBanksDto })
	@ValidateNested()
	@Type(() => GetAllBanksDto)
	declare data: GetAllBanksDto;
}
