import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class LikeEventDto {
	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	id!: number;
}

export class LikeEventMetaDataDto extends BaseDto<LikeEventDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(LikeEventDto) }],
		type: () => LikeEventDto,
	})
	@ValidateNested()
	@Type(() => LikeEventDto)
	declare data: LikeEventDto;
}
