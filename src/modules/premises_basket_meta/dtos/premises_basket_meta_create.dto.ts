import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreatePremisesBasketMetaDto {
	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	client_id!: number;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	agent_id!: number;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	project_id!: number;
}

export class CreatePremisesBasketMetaMetaDataDto extends BaseDto<CreatePremisesBasketMetaDto> {
	@ApiProperty({})
	@ValidateNested()
	@Type(() => CreatePremisesBasketMetaDto)
	declare data: CreatePremisesBasketMetaDto;
}
