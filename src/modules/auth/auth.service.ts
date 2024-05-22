import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserCreateDto } from 'modules/user/dtos/user.dto';
import * as bcrypt from 'bcrypt';
// import { NodeMailerService } from '../../common/nodemailer/nodemailer.service';
import {
  AgentLoginDto,
  LoginSuccess,
  UserLoginDto,
  UserLoginResendCodeDto,
  UserLoginVerifyCodeDto,
} from './dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    // private nodemailer: NodeMailerService,
  ) {}

  hasOneMinutePassed(startTime: Date): boolean {
    const oneMinute = 60 * 1000; // 60 seconds * 1000 milliseconds
    const currentTime = new Date();
    const elapsedTime = currentTime.getTime() - startTime.getTime();
    return elapsedTime >= oneMinute;
  }

  async createUser(body: UserCreateDto): Promise<any> {
    try {
      if (!body.username || !body.email) {
        return new HttpException(
          'Username or Password not provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingUser = await this.userService.findOne({
        username: body.username,
      });

      if (existingUser) {
        return new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const newUser = await this.userService.createUser({
        username: body.username,
        password: hashedPassword,
        email: body.email,
      });

      const { password, ...result } = newUser;

      /**
       * Todo  , We can make a url to send an email with jwt to get user
       */

      return result;
    } catch (error) {
      console.log('Account creating error');
      return new HttpException('Something went wrong', 500);
    }
  }

  async loginAccount(loginDto: UserLoginDto): Promise<LoginSuccess | any> {
    try {
      const user = await this.userService.findOne({ email: loginDto.email });
      console.log(
        {
          user,
        },
        loginDto,
      );

      if (!user) {
        console.log('User not found ');
        // send brunsika crm to get user
        // if(user) {
        // user.create(user)
        // user = newUser
        // } else {
        return new UnauthorizedException('User not found');
        // }
      }

      // if (user.password === null) {
      //   console.log('Users password is null');
      //   return new UnauthorizedException('Password not set');
      // }

      // const passwordMatch = await bcrypt.compare(
      //   loginDto.password,
      //   user.password,
      // );

      // if (!passwordMatch) {
      //   console.log('Password did not match');
      //   return new UnauthorizedException('Invalid email or password');
      // }

      // await this.nodemailer.sendMail();

      const { password, ...result } = user;
      return {
        accessToken: this.jwtService.sign(result),
      };
    } catch (error: any) {
      console.error('Login error:', error.message);
      return new HttpException('internal server error', 500);
    }
  }

  async agentLogin(agentLoginDto: AgentLoginDto): Promise<LoginSuccess | any> {
    try {
      const user = await this.userService.findOne({
        phone: agentLoginDto.phone,
      });
      console.log(
        {
          user,
        },
        agentLoginDto,
      );

      if (!user) {
        // send request crm backend and find user
        // if(user) {
        // save this user
        // } else {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
        // }
      }

      // const passwordMatch = await bcrypt.compare(
      //   agentLoginDto.password,
      //   user.password,
      // );

      // if (!passwordMatch) {
      //   console.log('Password did not match');
      //   return new UnauthorizedException('Invalid email or password');
      // }

      if (user.settings?.isPhoneVerified) {
        // todo send code to phone number
        const randomNumber = Math.floor(100000 + Math.random() * 900000);

        console.log(randomNumber, user.id);

        await this.userService.updateUser(user.id, {
          verification_code: randomNumber,
          verification_code_sent_date: new Date(),
        });

        return new HttpException(
          { userId: user.id, message: 'sms sent' },
          HttpStatus.OK,
        );
        // const { password, ...result } = user;
        // return {
        //   accessToken: this.jwtService.sign(result),
        // };
      } else {
        // todo
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      return new HttpException(error.message, 500);
    }
  }

  async verifySmsCode(
    dto: UserLoginVerifyCodeDto,
  ): Promise<LoginSuccess | any> {
    try {
      const user = await this.userService.findOne({
        id: dto.user_id,
      });
      console.log(
        {
          user,
        },
        dto,
      );

      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.settings?.isPhoneVerified) {
        if (user.verification_code_sent_date) {
          if (this.hasOneMinutePassed(user.verification_code_sent_date)) {
            return new HttpException(
              {
                error: 'verification code expired',
              },
              HttpStatus.GONE,
            );
          } else {
            if (user.verification_code === dto.code) {
              return {
                accessToken: this.jwtService.sign({
                  user_id: user.id,
                  role: user.role,
                }),
              };
            } else {
              return new HttpException(
                {
                  error: 'Verification code is not correct',
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
        }
      } else {
        // todo
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      return new HttpException(error.message, 500);
    }
  }

  async agentLoginResendSmsCode(
    dto: UserLoginResendCodeDto,
  ): Promise<LoginSuccess | any> {
    try {
      const user = await this.userService.findOne({
        phone: dto.user_id,
      });
      console.log(
        {
          user,
        },
        dto,
      );

      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.settings?.isPhoneVerified) {
        // todo send code to phone number
        if (user.verification_code_sent_date) {
          if (this.hasOneMinutePassed(user.verification_code_sent_date)) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);

            console.log(randomNumber, user.id);

            await this.userService.updateUser(user.id, {
              verification_code: randomNumber,
              verification_code_sent_date: new Date(),
            });

            return new HttpException(
              { userId: user.id, message: 'sms sent' },
              HttpStatus.OK,
            );
          } else {
            return new HttpException(
              {
                error:
                  'A valid verification code already exists or wait till expire',
              },
              HttpStatus.CONFLICT,
            );
          }
        }
      } else {
        // todo
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      return new HttpException({ error: 'internal server error' }, 500);
    }
  }

  async getUser(email: string): Promise<any> {
    try {
      const user = await this.userService.findByUsernameOrEmail({ email });
      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error: any) {
      console.log({
        errroGettingUser: error,
      });
      return new HttpException(error.message, 500);
    }
  }
}
