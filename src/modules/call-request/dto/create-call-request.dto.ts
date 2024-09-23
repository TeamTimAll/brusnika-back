import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateCallRequestDto {
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
	premise_id!: number;

	@ApiProperty()
	@IsString()
	@IsPhoneNumber()
	@IsNotEmpty()
	phone!: string;
}

export class CreateCallRequestMetaDataDto extends BaseDto<CreateCallRequestDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateCallRequestDto) }],
		type: () => CreateCallRequestDto,
	})
	@ValidateNested()
	@Type(() => CreateCallRequestDto)
	declare data: CreateCallRequestDto;
}
