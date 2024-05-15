import {  Body, Controller, Get, Post, Req, UseGuards ,Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserCreateDto  , UserLoginDto } from '../../modules/user/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post("login")
  @UseGuards(LocalGuard)
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ) {
      return this.authService.loginAccount(userLoginDto)
  }

  @Post() 
  createAccount( @Body() register : UserCreateDto ) {
               return  this.authService.createUser(register)
  }

  @Get(":email")
  getUser(@Param("email")  email : string ){
        return this.authService.getUser(email)
  }

  @Get() 
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}