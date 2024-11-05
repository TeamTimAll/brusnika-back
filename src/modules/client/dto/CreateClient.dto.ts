import { ApiProperty, PickType, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

import { ClientDto } from "./Client.dto";

export class CreateClientDto extends PickType(ClientDto, [
	"fullname",
	"phone_number",
	"comment",
	"agent_id",
	"confirmation_type",
]) {}

export class CreateClientMetaDataDto extends BaseDto<CreateClientDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateClientDto) }],
		type: () => CreateClientDto,
	})
	@ValidateNested()
	@Type(() => CreateClientDto)
	declare data: CreateClientDto;
}
