import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class ToggleNewsDto {
	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	news_id!: number;
}

export class ToggleNewsMetaDataDto extends BaseDto<ToggleNewsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(ToggleNewsDto) }],
		type: () => ToggleNewsDto,
	})
	@ValidateNested()
	@Type(() => ToggleNewsDto)
	declare data: ToggleNewsDto;
}
