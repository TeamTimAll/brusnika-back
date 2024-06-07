import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateProjectDto {
	@ApiProperty({
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	detailed_description!: string;

	@ApiProperty({
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	brief_description!: string;

	@ApiProperty({
		required: true,
		type: Number,
	})
	@IsNotEmpty()
	@IsNumber()
	price!: number;

	@ApiProperty({
		required: true,
	})
	@IsNotEmpty()
	@IsString()
	location!: string;

	@ApiProperty({
		required: true,
	})
	@IsNotEmpty()
	@IsDateString()
	end_date!: Date;

	@ApiProperty({
		required: true,
	})
	@IsString()
	photo!: string;
}

export class CreateProjectMetaDataDto extends BaseDto<CreateProjectDto> {
	@ApiProperty({
		default: [
			{
				name: "Name",
				detailed_description: "Something deatiled about the project",
				brief_description: "Brief description about the project",
				price: 0,
				location: "Brief description about the project",
				end_date: new Date(),
				photo: "string",
			} as CreateProjectDto,
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => CreateProjectDto)
	declare data: CreateProjectDto[];
}
