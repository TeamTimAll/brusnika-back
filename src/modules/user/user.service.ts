import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
// import { plainToClass } from 'class-transformer';
import { type FindOptionsWhere, Repository } from 'typeorm';
// import { Transactional } from 'typeorm-transactional';

import { type PageDto } from '../../common/dto/page.dto';
import { UserNotFoundException } from '../../exceptions';
// import { IFile } from '../../interfaces';
// import { AwsS3Service } from '../../shared/services/aws-s3.service';
// import { ValidatorService } from '../../shared/services/validator.service';
// import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { CreateSettingsCommand } from './commands/create-settings.command';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import { UserCreateDto , type UserDto } from './dtos/user.dto';
import { type UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { type UserSettingsEntity } from './user-settings.entity';
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class UserService {
  // private validatorService!: ValidatorService;
  private commandBus!: CommandBus;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    // private awsS3Service: AwsS3Service,
  ) {}

  /**
   * Find single user
   */

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

  // @Transactional()
  async createUser(
    userRegisterDto: UserCreateDto,
    // file?: IFile,
  ): Promise<any> {

    console.log({
      userDto : userRegisterDto
    })

    const user: any =  await this.userRepository.create(userRegisterDto);
    console.log({
       user : user
    })

    return user 
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
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
