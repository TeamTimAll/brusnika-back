import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMobilePhone, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserLoginResendCodeDto {
	@ApiProperty({
		required: true,
	})
	@IsMobilePhone()
	readonly phone!: string;
}

export class UserLoginResendCodeMetaDataDto extends BaseDto<UserLoginResendCodeDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserLoginResendCodeDto) }],
		type: () => UserLoginResendCodeDto,
	})
	@ValidateNested()
	@Type(() => UserLoginResendCodeDto)
	declare data: UserLoginResendCodeDto;
}
