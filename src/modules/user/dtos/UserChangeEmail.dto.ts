import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserChangeEmailDto {
	@ApiProperty({ required: false })
	@IsEmail()
	@IsNotEmpty()
	email!: string;
}

export class UserChangeEmailMetaDataDto extends BaseDto<UserChangeEmailDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserChangeEmailDto) }],
		type: () => UserChangeEmailDto,
	})
	@ValidateNested()
	@Type(() => UserChangeEmailDto)
	declare data: UserChangeEmailDto;
}
