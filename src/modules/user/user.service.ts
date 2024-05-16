import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';
import { type PageDto } from '../../common/dto/page.dto';
import { UserNotFoundException } from '../../exceptions';
import { CreateSettingsCommand } from './commands/create-settings.command';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import { UserCreateDto, type UserDto } from './dtos/user.dto';
import { type UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { type UserSettingsEntity } from './user-settings.entity';
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class UserService {
  private commandBus!: CommandBus;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');

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
      console.log({ userDto: userRegisterDto });

      const user: UserEntity = this.userRepository.create(userRegisterDto);
      const savedUser: UserEntity = await this.userRepository.save(user);

      console.log({ user: savedUser });

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

  async createSettings(
    userId: Uuid,
    createSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }
}
