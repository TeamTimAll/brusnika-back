import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsUUID,
	ValidateNested,
} from "class-validator";

import { Uuid } from "boilerplate.polyfill";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateUserPremisesBasketDto {
	@ApiProperty()
	@IsUUID("4")
	@IsNotEmpty()
	meta_id!: Uuid;
}

export class CreateUserPremisesBasketMetaDataDto extends BaseDto<CreateUserPremisesBasketDto> {
	@ApiProperty({
		example: [
			{
				meta_id: "a949e0ad-97cc-4dfa-81bb-efe191eb903b",
			} as CreateUserPremisesBasketDto,
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => CreateUserPremisesBasketDto)
	declare data: CreateUserPremisesBasketDto[];
}
