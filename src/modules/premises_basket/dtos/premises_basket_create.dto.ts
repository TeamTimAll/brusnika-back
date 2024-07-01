import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsUUID, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreatePremisesBasketDto {
	@ApiProperty()
	@IsUUID("4")
	@IsNotEmpty()
	meta_id!: string;
}

export class CreatePremisesBasketMetaDataDto extends BaseDto<CreatePremisesBasketDto> {
	@ApiProperty({
		example: {
			meta_id: "a949e0ad-97cc-4dfa-81bb-efe191eb903b",
		} as CreatePremisesBasketDto,
	})
	@ValidateNested()
	@Type(() => CreatePremisesBasketDto)
	declare data: CreatePremisesBasketDto;
}
