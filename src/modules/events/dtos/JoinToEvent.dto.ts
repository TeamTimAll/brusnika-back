import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class JoinToEventDto {
	@ApiProperty({ default: 1 })
	@IsInt()
	@IsNotEmpty()
	id!: number;
}

export class JoinToEventMetaDataDto extends BaseDto<JoinToEventDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(JoinToEventDto) }],
		type: () => JoinToEventDto,
	})
	@ValidateNested()
	@Type(() => JoinToEventDto)
	declare data: JoinToEventDto;
}
