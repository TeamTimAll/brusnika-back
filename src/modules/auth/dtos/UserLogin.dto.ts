import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserLoginDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	readonly email!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly password!: string;
}

export class UserLoginMetaDataDto extends BaseDto<UserLoginDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserLoginDto) }],
		type: () => UserLoginDto,
	})
	@ValidateNested()
	@Type(() => UserLoginDto)
	declare data: UserLoginDto;
}
