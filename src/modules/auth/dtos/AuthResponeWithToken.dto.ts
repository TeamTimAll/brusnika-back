import { ApiProperty } from "@nestjs/swagger";

import { UserRegisterStatus } from "../../user/user.entity";
import { BaseDto } from "../../../common/base/base_dto";

export class AuthResponeWithTokenDto {
	@ApiProperty({
		example: "jwt_token",
	})
	accessToken!: string;
}

export class AuthResponeWithTokenMetaDataDto extends BaseDto<AuthResponeWithTokenDto> {
	@ApiProperty({ type: AuthResponeWithTokenDto })
	declare data: AuthResponeWithTokenDto;
}

export class AuthResponeWithData {
	@ApiProperty({
		example: 1,
	})
	user_id!: number;

	@ApiProperty({
		example: "sms sent | verified | ok",
	})
	message!: string;

	@ApiProperty({
		example: Object.values(UserRegisterStatus).join(" | "),
	})
	register_status!: string;
}
