import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateCitiesDto {
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
		example: "Moscow",
	})
	@IsString()
	name!: string;

	@ApiProperty({ example: "0.00" })
	@IsNotEmpty()
	@IsString()
	long!: string;

	@ApiProperty({ example: "0.00" })
	@IsNotEmpty()
	@IsString()
	lat!: string;
}

export class CreateCitiesMetaDataDto extends BaseDto<CreateCitiesDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateCitiesDto) }],
		type: () => CreateCitiesDto,
	})
	@ValidateNested()
	@Type(() => CreateCitiesDto)
	declare data: CreateCitiesDto;
}
