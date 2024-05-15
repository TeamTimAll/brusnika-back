import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; 
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRepository(User) 
    private userRepository: Repository<User>, 
  ) {}

  async createUser(body: User) {
    try {
      // Check if the user already exists
      const existingUser = await this.userRepository.findOne({ where: { username: body.username } });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      // Create a new user
      const newUser = await this.userRepository.save(body);

      // Omit the password from the response
      const { password, ...result } = newUser;

      return result;
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginAccount(loginDto:  LoginDto) {
    try {
      // Find the user by email
      const user = await this.userRepository.findOne({ where: { email: loginDto.email } });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if the password matches
      if (user.password !== loginDto.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Omit the password from the response
      const { password, ...result } = user;

      // Sign and return the JWT token
      return this.jwt.sign(result);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Other methods for getAllUsers, deleteOneUser, and getUser...



  getUser( ) {
        return "Samandar"
  }
}
