import { EmailField, Roles, StringField } from '../../../decorators';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../constants';

export class UserLoginDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly password!: string;
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
