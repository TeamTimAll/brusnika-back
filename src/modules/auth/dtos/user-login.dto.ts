import { EmailField, Roles, StringField } from '../../../decorators';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../constants';
import { Uuid } from 'boilerplate.polyfill';
import { CreateAgenciesDto, CreateExistentAgenciesDto } from '../../agencies/dtos/create-agencies.dto';

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

export class AgentChooseAgencyDto {
  @IsUUID()
  @ApiProperty({
    required: true,
  })
  userId!: Uuid;

  @IsUUID()
  @ApiProperty({
    required: true,
  })
  agency_id!: Uuid;

  @IsDateString()
  @ApiProperty({
    required: true,
  })
  startWorkDate!: Date;
}

export class AgentRegisterAgencyDto extends CreateAgenciesDto {
  @IsUUID()
  @ApiProperty({
    required: true,
  })
  userId!: Uuid;

  @IsBoolean()
  @ApiProperty({
    required: true,
  })
  isOwner!: boolean;
}

export class AgentRequestAgencyDto extends CreateExistentAgenciesDto {
  @IsUUID()
  @ApiProperty({
    required: true,
  })
  userId!: Uuid;
}

export class UserLoginVerifyCodeDto {
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  code!: number;

  @IsUUID()
  @ApiProperty({
    required: true,
  })
  user_id!: Uuid;
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
