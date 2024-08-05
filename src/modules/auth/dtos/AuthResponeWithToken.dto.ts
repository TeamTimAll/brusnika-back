import { ApiProperty } from "@nestjs/swagger";

import { UserRegisterStatus } from "../../user/user.entity";

export class AuthResponeWithToken {
	@ApiProperty({
		example: "jwt_token",
	})
	accessToken!: string;
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

