import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService   } from '../user/user.service';
import { UserCreateDto , UserLoginDto } from 'modules/user/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { NodeMailerService } from '../../common/nodemailer/nodemailer.service';




@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private  nodemailer  : NodeMailerService
  ) {}


  async createUser(body: UserCreateDto): Promise<any> {
       try {
        if (!body.username || !body.password || !body.email) {
          return  new HttpException(
            'Username or Password not provided',
            HttpStatus.BAD_REQUEST,
          );
        }
    
        const existingUser = await this.userService.findOne({
          username: body.username,
        });
    
        if (existingUser) {
          return  new HttpException('User already exists', HttpStatus.CONFLICT);
        }
    
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = await this.userService.createUser({
          username: body.username,
          password: hashedPassword,
          email: body.email,
        });
    
        const { password, ...result } = newUser;

        await this.nodemailer.sendMail()
        
        return result;
        
       } catch (error) {
        console.log("Account creating error")
        return new HttpException("Something went wrong", 500)
       }
  }


  async loginAccount(loginDto: UserLoginDto): Promise<any> {

    try {
      const user = await this.userService.findOne({ email: loginDto.email });
      console.log({
         loginDto 
      });

  
      if (!user) {
        console.log("User not found ")
        return  new UnauthorizedException('User not found');
      }
  
      if (user.password === null) {
        console.log("Users password is null")
        return  new UnauthorizedException('Password not set');
      }
      
  
       const passwordMatch= await  bcrypt.compare( loginDto.password , user.password )
      
      if (!passwordMatch) {
        console.log("Password did not match")
        return  new UnauthorizedException('Invalid email or password');
      };

      await this.nodemailer.sendMail()

      const { password, ...result } = user;
      return {
        accessToken: this.jwtService.sign(result),
      };

    } catch (error : any )  {
      console.error('Login error:', error.message);
      return  new  HttpException(error.message ,500)

    }
  }
  

  async getUser(email: string): Promise<any> {
    try {
      const user = await this.userService.findByUsernameOrEmail({ email });
      if (!user) {
        return  new HttpException('User not found', HttpStatus.NOT_FOUND);
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
