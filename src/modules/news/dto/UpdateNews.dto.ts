import { ApiProperty, getSchemaPath, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

import { CreateNewsDto } from "./CreateNews.dto";

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}

export class UpdateNewsMetaDataDto extends BaseDto<UpdateNewsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UpdateNewsDto) }],
		type: () => UpdateNewsDto,
	})
	@ValidateNested()
	@Type(() => UpdateNewsDto)
	declare data: UpdateNewsDto;
}
