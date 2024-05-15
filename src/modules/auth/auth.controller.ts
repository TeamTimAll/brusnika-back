import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { UserCreateDto, UserLoginDto } from '../../modules/user/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  // @UseGuards(LocalGuard)
  // @UsePipes(ValidationPipe)
  login(@Body() loginBody: UserLoginDto) {
    return this.authService.loginAccount(loginBody);
  }

  @Post()
  createAccount(@Body() register: UserCreateDto) {
    return this.authService.createUser(register);
  }

  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.authService.getUser(email);
  }

  @Get() // needs to be given token to Bearer
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
