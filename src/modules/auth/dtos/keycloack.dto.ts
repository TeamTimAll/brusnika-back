import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class KeycloakDto {
	@ApiProperty()
	@IsString()
	code!: string;

	@ApiProperty()
	@IsString()
	redirectUri!: string;
}

export class KeycloakMetaDataDto extends BaseDto<KeycloakDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(KeycloakDto) }],
		type: () => KeycloakDto,
	})
	@ValidateNested()
	@Type(() => KeycloakDto)
	declare data: KeycloakDto;
}
