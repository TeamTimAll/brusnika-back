import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageDto } from '../../common/dto/page.dto';
import { ApiPageOkResponse, AuthUser, UUIDParam } from '../../decorators';
import {
  UserChangePhoneVerifyCodeDto,
  UserCreateDto,
  UserDto,
  UserUpdateDto,
} from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserService } from './user.service';
import { Uuid } from 'boilerplate.polyfill';
import { ICurrentUser } from 'interfaces/current-user.interface';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  // @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  // @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

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
