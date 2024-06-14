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

export class CreatePremisesBasketMetaDto {
	@ApiProperty()
	@IsUUID("4")
	@IsNotEmpty()
	client_id!: Uuid;

	@ApiProperty()
	@IsUUID("4")
	@IsNotEmpty()
	agent_id!: string;

	@ApiProperty()
	@IsUUID("4")
	@IsNotEmpty()
	project_id!: string;
}

export class CreatePremisesBasketMetaMetaDataDto extends BaseDto<CreatePremisesBasketMetaDto> {
	@ApiProperty({
		example: [
			{
				client_id: "a949e0ad-97cc-4dfa-81bb-efe191eb903b",
			} as CreatePremisesBasketMetaDto,
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => CreatePremisesBasketMetaDto)
	declare data: CreatePremisesBasketMetaDto[];
}
