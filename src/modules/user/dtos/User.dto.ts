import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";
import { UserEntity, UserRegisterStatus, UserStatus } from "../user.entity";

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export type IUserDto = Omit<
	UserEntity,
	"ext_id" | "comments" | "city" | "agency" | "bookings" | "visits"
>;

export class UserDto implements IUserDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

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
	is_phone_verified?: boolean;

	@ApiProperty()
	is_email_verified?: boolean;

	is_verified?: boolean | undefined;

	@ApiProperty({ enum: RoleType })
	temporary_role?: RoleType;

	@ApiProperty()
	temporary_number!: string;

	@ApiProperty()
	temporary_email!: string;

	@ApiProperty({ enum: UserStatus })
	status!: UserStatus;

	@ApiProperty()
	city_id?: number;

	@ApiProperty()
	agency_id?: number;

	@ApiProperty()
	is_active!: boolean;
}

export class UserMetaDataDto extends BaseDto<UserDto> implements Dto {
	@ApiProperty({ type: UserDto })
	declare data: UserDto;

	desc = `### User ma'lumotlari
	\n **data**'da user entity ma'lumotlari`;
}
