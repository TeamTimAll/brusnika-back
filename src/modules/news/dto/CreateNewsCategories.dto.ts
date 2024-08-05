import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateNewsCategoriesDto {
	@ApiProperty({
		description: "Name of the category",
		example: "Politics",
	})
	@IsNotEmpty()
	name!: string;
}

export class CreateNewsCategoriesMetaDataDto extends BaseDto<CreateNewsCategoriesDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateNewsCategoriesDto) }],
		type: () => CreateNewsCategoriesDto,
	})
	@ValidateNested()
	@Type(() => CreateNewsCategoriesDto)
	declare data: CreateNewsCategoriesDto;
}
