import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreatePremisesBasketMetaDto {
	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	client_id!: number;

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	agent_id!: number;

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	project_id!: number;
}

export class CreatePremisesBasketMetaMetaDataDto extends BaseDto<CreatePremisesBasketMetaDto> {
	@ApiProperty({})
	@ValidateNested()
	@Type(() => CreatePremisesBasketMetaDto)
	declare data: CreatePremisesBasketMetaDto;
}
