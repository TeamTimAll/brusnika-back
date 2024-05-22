import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  // Param,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserCreateDto } from '../../modules/user/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AgentLoginDto,
  LoginSuccess,
  UserLoginDto,
  UserLoginResendCodeDto,
  UserLoginVerifyCodeDto,
} from './dtos/user-login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'login' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginSuccess,
  })
  @Post('login')
  @UseGuards(LocalGuard)
  async userLogin(@Body() userLoginDto: UserLoginDto) {
    return this.authService.loginAccount(userLoginDto);
  }

  @ApiOperation({ summary: 'agent login' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginSuccess,
  })
  @Post('/login/agent')
  async agentLogin(@Body() agentLoginDto: AgentLoginDto) {
    return this.authService.agentLogin(agentLoginDto);
  }

  @ApiOperation({ summary: 'agent login verify' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginSuccess,
  })
  @Post('/login/agent/verify')
  async agentLoginVerify(@Body() userLoginVerifyCodeDto: UserLoginVerifyCodeDto) {
    return this.authService.verifySmsCode(userLoginVerifyCodeDto);
  }

  @ApiOperation({ summary: 'agent login resend' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginSuccess,
  })
  @Post('/login/agent/resend')
  async agentLoginResendSmsCode(@Body() dto: UserLoginResendCodeDto) {
    return this.authService.agentLoginResendSmsCode(dto);
  }

  @Post('/agent/create')
  createAccount(@Body() dao: UserCreateDto) {
    return this.authService.createUser(dao);
  }

  // @Get(':email')
  // getUser(@Param('email') email: string) {
  //   return this.authService.getUser(email);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
