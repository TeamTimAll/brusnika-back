import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserCreateDto, UserLoginDto } from 'modules/user/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';






@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}


  async createUser(body: UserCreateDto): Promise<any> {
    if (!body.username || !body.password) {
      throw new HttpException(
        'Username or Password not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.userService.findOne({
      username: body.username,
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await this.userService.createUser({
      username: body.username,
      password: hashedPassword,
      email: body.email,
    });


    const { password, ...result } = newUser;
    return result;
  }


  /**
   *  TODO check login
   */

  async loginAccount(loginDto: UserLoginDto): Promise<any> {
    try {
      const user = await this.userService.findOne({ email: loginDto.email });
      console.log({
         user 
      }, loginDto)
  
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      if (user.password === null) {
        throw new UnauthorizedException('Password not set');
      }
  
      const passwordMatch = await compare(loginDto.password,user.password )
      
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      const { password, ...result } = user;
      return {
        accessToken: this.jwtService.sign(result),
      };
    } catch (error) {

      console.error('Login error:', error);
      throw new  HttpException("Something went wrong" ,500)

    }
  }
  

  async getUser(email: string): Promise<any> {
    try {
      const user = await this.userService.findByUsernameOrEmail({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;

    } catch (error : any ) {
      console.log({
        errroGettingUser : error
      })
      return  new HttpException(error.message , 500)
    }
  }
}
