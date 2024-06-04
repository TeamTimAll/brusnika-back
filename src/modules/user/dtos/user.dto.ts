import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import {
  BooleanFieldOptional,
  EnumFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators';
import { ClassField } from '../../../decorators';

import { EmailField, StringField } from '../../../decorators';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity, UserRegisterStatus } from '../user.entity';
import { Uuid } from 'boilerplate.polyfill';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @StringFieldOptional({ nullable: true })
  password!: string;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @PhoneFieldOptional({ nullable: true })
  temporaryNumber?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  birthDate?: Date | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  workStartDate?: Date | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  verification_code?: number | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  verification_code_sent_date?: Date | null;

  @IsEnum(UserRegisterStatus)
  @IsOptional()
  @ApiProperty({ required: false })
  register_status?: UserRegisterStatus | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  isPhoneVerified?: boolean;

  @IsUUID()
  @ApiProperty({
    required: false,
  })
  city_id?: Uuid;

  @ApiProperty({ description: 'The agency ID of the user' })
  @IsOptional()
  @IsUUID()
  agency_id?: string;
  status: boolean;

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
    this.phone = user.phone;
    this.birthDate = user.birthDate;
    this.workStartDate = user.workStartDate;
    this.verification_code = user.verification_code;
    this.verification_code_sent_date = user.verification_code_sent_date;
    this.avatar = user.avatar;
    this.register_status = user.register_status;
    this.isPhoneVerified = user.isPhoneVerified;
    this.temporaryNumber = user.temporaryNumber;
    this.status = user.status;
    this.city_id = user.city?.id;
    this.agency_id = user.agency?.id;
  }
}

export class UserCreateDto {
  @IsMobilePhone()
  @ApiProperty({ required: true })
  phone!: string;
}

export class UserChangePhoneVerifyCodeDto {
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  code!: number;
}

export class UserUpdateDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;

  @StringFieldOptional({ nullable: true })
  avatar?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  birthDate?: Date;

  @IsUUID()
  @ApiProperty({
    required: false,
  })
  city_id?: Uuid;
}

export class UserFillDataDto {
  @IsUUID()
  @ApiProperty({
    required: true,
  })
  id!: Uuid;

  @IsString()
  @ApiProperty({
    required: true,
  })
  firstName!: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  lastName!: string;

  @IsUUID()
  @ApiProperty({
    required: true,
  })
  city_id!: Uuid;

  @IsDateString()
  @ApiProperty({ required: true })
  birthDate!: Date;

  @IsEmail()
  @ApiProperty({ required: true })
  email!: string;
}

export class UserLoginDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly password!: string;
}

export class LoginPayloadDto {
  @ClassField(() => UserDto)
  user: UserDto;

  constructor(user: UserDto) {
    this.user = user;
  }
}
