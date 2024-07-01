import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateCitiesDto {
	@IsString()
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	name!: string;
}

export class CreateCitiesMetaDataDto extends BaseDto<CreateCitiesDto> {
	@ApiProperty({ example: { name: "moscow" } as CreateCitiesDto })
	@ValidateNested()
	@Type(() => CreateCitiesDto)
	declare data: CreateCitiesDto;
}
