import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  IsPassword,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators';

import { type UserEntity } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor() {
    this.username = '';
    this.email = '';
    this.password = '';
  }
}

export class UserLoginDto {
  @ApiProperty({ description: 'email', required: true })
  @IsString()
  email!: string;
  @ApiProperty({ description: 'password', required: true })
  @IsPassword()
  password!: string;

  // constructor() {
  //   this.password = '';
  //   this.email = '';
  // }
}
