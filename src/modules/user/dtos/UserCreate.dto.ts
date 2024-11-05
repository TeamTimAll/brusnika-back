import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMobilePhone, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";

export class UserCreateDto {
	@ApiProperty({ required: true })
	@IsMobilePhone()
	phone!: string;

	role?: RoleType;
}

export class UserCreateMetaDataDto extends BaseDto<UserCreateDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserCreateDto) }],
		type: () => UserCreateDto,
	})
	@ValidateNested()
	@Type(() => UserCreateDto)
	declare data: UserCreateDto;
}
