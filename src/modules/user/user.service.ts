import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';
import { type PageDto } from '../../common/dto/page.dto';
import { UserNotFoundException } from '../../exceptions';
import {
  UserChangePhoneVerifyCodeDto,
  UserCreateDto,
  type UserDto,
} from './dtos/user.dto';
import { type UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { Uuid } from 'boilerplate.polyfill';
import { ICurrentUser } from 'interfaces/current-user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  hasOneMinutePassed(startTime: Date): boolean {
    const oneMinute = 60 * 1000; // 60 seconds * 1000 milliseconds
    const currentTime = new Date();
    const elapsedTime = currentTime.getTime() - startTime.getTime();
    return elapsedTime >= oneMinute;
  }

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(userRegisterDto: UserCreateDto): Promise<UserEntity> {
    try {
      const user: UserEntity = this.userRepository.create(userRegisterDto);
      const savedUser: UserEntity = await this.userRepository.save(user);

      return savedUser;
    } catch (error: any) {
      // Handle any potential errors (e.g., database errors)
      throw new Error('Failed to create user: ' + error.message);
    }
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = await this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    // const queryBuilder = await this.userRepository.createQueryBuilder('user');

    // await queryBuilder.where('user.id = :userId', { userId });
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['city', 'agency'],
    });
    // const userEntity = await queryBuilder.getOne();

    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async updateUser(id: Uuid, updateEventsDto: Partial<UserDto>): Promise<any> {
    const user = this.findOne({
      id,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return await this.userRepository.update(id, updateEventsDto);
  }

  async changePhone(id: Uuid, dto: UserCreateDto): Promise<any> {
    const user = await this.findOne({
      id,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (
      user.verification_code_sent_date &&
      !this.hasOneMinutePassed(user.verification_code_sent_date)
    ) {
      return new HttpException(
        {
          error: 'A valid verification code already exists or wait till expire',
        },
        HttpStatus.CONFLICT,
      );
    }

    // const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const randomNumber = 111111;

    console.log(randomNumber, user.id);

    await this.updateUser(user.id, {
      verification_code: randomNumber,
      verification_code_sent_date: new Date(),
      temporaryNumber: dto.phone,
    });

    // todo send sms

    return new HttpException(
      { userId: user.id, message: 'sms sent' },
      HttpStatus.OK,
    );
  }

  async verifySmsCode(
    user: ICurrentUser,
    dto: UserChangePhoneVerifyCodeDto,
  ): Promise<any> {
    try {
      const foundUser = await this.getUser(user.id);

      if (!foundUser) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (foundUser.isPhoneVerified) {
        if (foundUser.verification_code_sent_date) {
          if (this.hasOneMinutePassed(foundUser.verification_code_sent_date)) {
            return new HttpException(
              {
                error: 'verification code expired',
              },
              HttpStatus.GONE,
            );
          } else {
            if (foundUser.verification_code === dto.code) {
              await this.updateUser(foundUser.id, {
                phone: foundUser.temporaryNumber,
                temporaryNumber: null,
                verification_code: null,
                verification_code_sent_date: null,
                isPhoneVerified: true,
              });
              return {
                message: 'Verification code is correct',
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
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      return new HttpException(error.message, 500);
    }
  }

  async agentLoginResendSmsCode(currentUser: ICurrentUser): Promise<any> {
    try {
      const user = await this.getUser(currentUser.id);

      if (!user) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.verification_code_sent_date) {
        if (this.hasOneMinutePassed(user.verification_code_sent_date)) {
          // const randomNumber = Math.floor(100000 + Math.random() * 900000);
          const randomNumber = 111111;

          console.log(randomNumber, user.id);
          // todo send sms
          await this.updateUser(user.id, {
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
    } catch (error: any) {
      console.error('Login error:', error.message);
      return new HttpException({ error: 'internal server error' }, 500);
    }
  }
}
