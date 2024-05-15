import {  Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe ,Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { UserCreateDto } from '../../modules/user/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
// import { UserCreateDto } from '../../modules/user/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalGuard)
  @UsePipes(ValidationPipe)
  login(@Req() req: Request) {
    return  req.user;
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