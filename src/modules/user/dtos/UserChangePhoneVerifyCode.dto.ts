import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserChangePhoneVerifyCodeDto {
	@ApiProperty({
		required: true,
	})
	@IsNumber()
	code!: number;
}

export class UserChangePhoneVerifyCodeMetaDataDto extends BaseDto<UserChangePhoneVerifyCodeDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserChangePhoneVerifyCodeDto) }],
		type: () => UserChangePhoneVerifyCodeDto,
	})
	@ValidateNested()
	@Type(() => UserChangePhoneVerifyCodeDto)
	declare data: UserChangePhoneVerifyCodeDto;
}
