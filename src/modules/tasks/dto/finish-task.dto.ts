import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class FinishTaskDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	result!: string;
}

export class FinishTaskMetaDataDto extends BaseDto<FinishTaskDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(FinishTaskDto) }],
		type: () => FinishTaskDto,
	})
	@ValidateNested()
	@Type(() => FinishTaskDto)
	declare data: FinishTaskDto;
}
