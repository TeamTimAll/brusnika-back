import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import {
  BooleanFieldOptional,
  ClassField,
  EmailFieldOptional,
  EnumFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators';
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

  @IsNumber()
  verification_code?: number | null;

  @IsDate()
  verification_code_sent_date?: Date | null;

  // constructor(user: UserEntity, options?: UserDtoOptions) {
  //   super(user);
  //   this.firstName = user.firstName;
  //   this.lastName = user.lastName;
  //   this.role = user.role;
  //   this.email = user.email;
  //   this.avatar = user.avatar;
  //   this.phone = user.phone;
  //   this.isActive = options?.isActive;
  // }
}

export class UserCreateDto {
  @IsString()
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  last_name!: string;

  @IsPhoneNumber()
  @ApiProperty({
    required: true
  })
  phone!: string;

  @IsEmail()
  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  email!: string;
}

export class LoginPayloadDto {
  @ClassField(() => UserDto)
  user: UserDto;

  constructor(user: UserDto) {
    this.user = user;
  }
}
