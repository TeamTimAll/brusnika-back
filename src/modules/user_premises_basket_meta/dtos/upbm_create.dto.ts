import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";

import { Uuid } from "boilerplate.polyfill";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateUPBMDto {
	@ApiProperty()
    @IsUUID("4")
    @IsNotEmpty()
	user_id!: Uuid;
}

export class CreateUPBMMetaDataDto extends BaseDto<CreateUPBMDto> {
	@ApiProperty({
		example: [
			{
				user_id: "a949e0ad-97cc-4dfa-81bb-efe191eb903b",
			} as CreateUPBMDto,
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => CreateUPBMDto)
	declare data: CreateUPBMDto[];
}
