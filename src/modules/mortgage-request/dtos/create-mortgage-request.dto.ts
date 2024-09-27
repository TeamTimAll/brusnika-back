import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateMortgageRequestDto {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	client_id!: number;

	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	building_id!: number;

	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	premise_id!: number;

	@ApiProperty({ example: 0 })
	@IsNotEmpty()
	@IsNumber()
	@Type(() => Number)
	cost!: number;

	@ApiProperty({ example: 0 })
	@IsNotEmpty()
	@IsNumber()
	@Type(() => Number)
	first_payment!: number;

	@ApiProperty({ example: "comment" })
	@IsNotEmpty()
	@IsString()
	comment!: string;
}

export class CreateMortgageRequestMetaDataDto extends BaseDto<CreateMortgageRequestDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateMortgageRequestDto) }],
		type: () => CreateMortgageRequestDto,
	})
	@ValidateNested()
	@Type(() => CreateMortgageRequestDto)
	declare data: CreateMortgageRequestDto;
}
