import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateProjectDto {
	@ApiProperty({
		required: true,
		example: "Project Name",
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		required: true,
		example: "Something deatiled about the project",
	})
	@IsNotEmpty()
	@IsString()
	detailed_description!: string;

	@ApiProperty({
		required: true,
		example: "Brief description about the project",
	})
	@IsNotEmpty()
	@IsString()
	brief_description!: string;

	@ApiProperty({
		required: true,
		type: Number,
		example: 0,
	})
	@IsNotEmpty()
	@IsNumber()
	price!: number;

	@ApiProperty({
		required: true,
		example: "Some address and some street.",
	})
	@IsNotEmpty()
	@IsString()
	location!: string;

	@ApiProperty({
		required: true,
		example: new Date(),
	})
	@IsNotEmpty()
	@IsDateString()
	end_date!: Date;

	@ApiProperty({
		required: true,
	})
	@IsString()
	photo!: string;

	@ApiProperty({ example: "0.00" })
	@IsOptional()
	@IsString()
	long!: string;

	@ApiProperty({ example: "0.00" })
	@IsOptional()
	@IsString()
	lat!: string;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	city_id!: number;
}

export class CreateProjectMetaDataDto extends BaseDto<CreateProjectDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateProjectDto) }],
		type: () => CreateProjectDto,
	})
	@ValidateNested()
	@Type(() => CreateProjectDto)
	declare data: CreateProjectDto;
}
