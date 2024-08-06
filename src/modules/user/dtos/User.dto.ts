import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";
import { UserEntity, UserRegisterStatus } from "../user.entity";

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export type IUserDto = Omit<
	UserEntity,
	"comments" | "city" | "agency" | "bookings" | "visits"
>;

export class UserDto implements IUserDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;

	@ApiProperty()
	firstName!: string;

	@ApiProperty()
	lastName!: string;

	@ApiProperty()
	role!: RoleType;

	@ApiProperty()
	email!: string;

	@ApiProperty()
	username!: string;

	@ApiProperty()
	password!: string;

	@ApiProperty()
	phone!: string;

	@ApiProperty()
	birthDate!: Date;

	@ApiProperty()
	workStartDate!: Date;

	@ApiProperty()
	verification_code!: number;

	@ApiProperty()
	verification_code_sent_date!: Date;

	@ApiProperty()
	email_verification_code!: number;

	@ApiProperty()
	email_verification_code_sent_date!: Date;

	@ApiProperty()
	avatar!: string;

	@ApiProperty({ enum: UserRegisterStatus })
	register_status!: UserRegisterStatus;

	@ApiProperty()
	fullName!: string;

	@ApiProperty()
	isPhoneVerified?: boolean;

	@ApiProperty()
	isEmailVerified?: boolean;

	@ApiProperty()
	temporaryNumber!: string;

	@ApiProperty()
	temporaryEmail!: string;

	@ApiProperty()
	status!: boolean;

	@ApiProperty()
	city_id?: number;

	@ApiProperty()
	agency_id?: number;
}

export class UserMetaDataDto extends BaseDto<UserDto> implements Dto {
	@ApiProperty({ type: UserDto })
	declare data: UserDto;

	desc = `### User ma'lumotlari
	\n **data**'da user entity ma'lumotlari`;
}
