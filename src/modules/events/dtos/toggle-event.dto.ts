import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class ToggleEventDto {
	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	event_id!: number;
}

export class ToggleEventMetaDataDto extends BaseDto<ToggleEventDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(ToggleEventDto) }],
		type: () => ToggleEventDto,
	})
	@ValidateNested()
	@Type(() => ToggleEventDto)
	declare data: ToggleEventDto;
}
