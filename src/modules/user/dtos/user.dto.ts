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
import { BaseDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';

import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from 'boilerplate.polyfill';
import { UserEntity, UserRegisterStatus } from '../user.entity';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends BaseDto {
  @IsString()
  @IsOptional()
  firstName?: string | null;

  @IsString()
  @IsOptional()
  lastName?: string | null;

  @IsString()
  @IsOptional()
  username!: string;

  @IsString()
  @IsOptional()
  password!: string;

  @IsEnum(RoleType)
  role?: RoleType;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string | null;

  @IsString()
  @IsOptional()
  avatar?: string | null;

  @IsMobilePhone()
  @IsOptional()
  phone?: string | null;

  @IsMobilePhone()
  @IsOptional()
  temporaryNumber?: string | null;

  @IsBoolean()
  @IsOptional()
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

export class UserUpdateDto extends BaseDto {
  @IsString()
  @IsOptional()
  firstName?: string | null;

  @IsString()
  @IsOptional()
  lastName?: string | null;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;

  @IsString()
  @IsOptional()
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
  @IsEmail()
  readonly email!: string;

  @IsString()
  readonly password!: string;
}
