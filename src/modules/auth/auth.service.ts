import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserCreateDto , UserLoginDto } from 'modules/user/dtos/user.dto';

@Injectable()
export class AuthService {
  @Inject() private jwt!: JwtService;
  @Inject() private userService!: UserService;
  constructor() {}

  async createUser(body: UserCreateDto) {
    const user = await this.userService.findOne({
      username: body.username,
    });

    if (!body || !body.username || !body.password) {
      throw new HttpException(
        'Username or Password not provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user) {
      throw new HttpException('User already exists', 409);
    }

    const newUser = await this.userService.createUser({
      username: body.username,
      password: body.password,
      email: body.email,
    });

    const { password, ...result } = newUser;

    return result;
  }

  async loginAccount(loginDto: UserLoginDto) {
    const user = await this.userService.findOne({
      email: loginDto.email,
    });

    if (!user) return new UnauthorizedException();

    if (user.password !== loginDto.password)
      return new HttpException('Password did not match', 403);
    const { password, ...result } = user;

    return this.jwt.sign(result);

  }



  async getUser(){
        return "Samandar"
  }

  // async getAllUsers() {
  //   try {
  //     const allUsers = await this.userService.findMany({
  //       select: {
  //         id: true,
  //         username: true,
  //         password: true,
  //       },
  //     });

  //     return allUsers;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Something went wrong',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async deleteOneUser(id: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //   });

  //   if (!user) {
  //     throw new HttpException('Uer not found ', HttpStatus.NOT_FOUND);
  //   }

  //   await this.prisma.user.delete({
  //     where: { id },
  //   });

  //   return user;
  // }

  // async getUser(id: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //     select: {
  //       username: true,
  //       password: true,
  //       id: true,
  //     },
  //   });

  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }

  //   return user;
  // }
}
