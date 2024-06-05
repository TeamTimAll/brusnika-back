import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';

import { ICurrentUser } from 'interfaces/current-user.interface';

import { AuthUser } from '../../decorators';

import {
  UserChangePhoneVerifyCodeDto,
  UserCreateDto,
  UserUpdateDto,
} from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('/')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updateUser(
    @Body() updateEventsDto: UserUpdateDto,
    @AuthUser() user: ICurrentUser,
  ): Promise<void> {
    return this.userService.updateUser(user.id, updateEventsDto);
  }

  @Post('/phone')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  changePhoneUser(
    @Body() dto: UserCreateDto,
    @AuthUser() user: ICurrentUser,
  ): Promise<void> {
    return this.userService.changePhone(user.id, dto);
  }

  @Post('/phone/verify')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  verifyPhone(
    @Body() dto: UserChangePhoneVerifyCodeDto,
    @AuthUser() user: ICurrentUser,
  ): Promise<void> {
    return this.userService.verifySmsCode(user, dto);
  }
}
