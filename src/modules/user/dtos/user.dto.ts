import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

import {
  BooleanFieldOptional,
  ClassField,
  EmailFieldOptional,
  EnumFieldOptional,
  IsPassword,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators';

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
  @IsNotEmpty()
  username: string;

  @IsPassword()
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

export class LoginPayloadDto {
  @ClassField(() => UserDto)
  user: UserDto;

  constructor(user: UserDto) {
    this.user = user;
  }
}
