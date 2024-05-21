import { EmailField, Roles, StringField } from '../../../decorators';
import {
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../constants';
import { Uuid } from 'boilerplate.polyfill';

export class UserLoginDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly password!: string;
}

export class AgentLoginDto {
  @IsMobilePhone()
  @ApiProperty({
    required: true,
  })
  readonly phone!: string;
}

export class UserLoginVerifyCodeDto {
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  readonly code!: number;

  @IsUUID()
  @ApiProperty({
    required: true,
  })
  readonly user_id!: Uuid;
}

export class UserLoginResendCodeDto {
  @IsUUID()
  @ApiProperty({
    required: true,
  })
  readonly user_id!: Uuid;
}

export class LoginSuccess {
  @IsString()
  @ApiProperty({ description: 'access token identity' })
  access_token_id: string | undefined;

  @IsEnum(Roles)
  @ApiProperty({ description: 'role' })
  @IsString()
  role: RoleType | undefined;
}
