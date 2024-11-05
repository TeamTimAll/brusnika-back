import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserLoginVerifyCodeDto {
	@ApiProperty({
		required: true,
	})
	@IsNumber()
	code!: number;

	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;
}

export class UserLoginVerifyCodeMetaDataDto extends BaseDto<UserLoginVerifyCodeDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserLoginVerifyCodeDto) }],
		type: () => UserLoginVerifyCodeDto,
	})
	@ValidateNested()
	@Type(() => UserLoginVerifyCodeDto)
	declare data: UserLoginVerifyCodeDto;
}
