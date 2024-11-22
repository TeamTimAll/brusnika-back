import {
	ApiProperty,
	ApiPropertyOptional,
	getSchemaPath,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class FinishTaskDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	comment?: string;
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
