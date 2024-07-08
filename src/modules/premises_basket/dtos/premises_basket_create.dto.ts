import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreatePremisesBasketDto {
	@ApiProperty()
	@IsInt()
@Type(() => Number)
	@IsNotEmpty()
	meta_id!: number;
}

export class CreatePremisesBasketMetaDataDto extends BaseDto<CreatePremisesBasketDto> {
	@ApiProperty({
		example: {
			meta_id: 1,
		} as CreatePremisesBasketDto,
	})
	@ValidateNested()
	@Type(() => CreatePremisesBasketDto)
	declare data: CreatePremisesBasketDto;
}
