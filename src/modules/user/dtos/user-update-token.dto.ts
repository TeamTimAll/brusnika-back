import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { UserStatus } from "../user.entity";

export class UserUpdateTokenDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	firebase_token!: UserStatus;
}

export class UserUpdateTokenMetaDataDto extends BaseDto<UserUpdateTokenDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserUpdateTokenDto) }],
		type: () => UserUpdateTokenDto,
	})
	@ValidateNested()
	@Type(() => UserUpdateTokenDto)
	declare data: UserUpdateTokenDto;
}
