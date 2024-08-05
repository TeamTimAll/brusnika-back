import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

import { ClientDto } from "./Client.dto";

export class CreateClientMetaDataDto extends BaseDto<ClientDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(ClientDto) }],
		type: () => ClientDto,
	})
	@ValidateNested()
	@Type(() => ClientDto)
	declare data: ClientDto;
}
