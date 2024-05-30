import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  VirtualColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { EventsEntity } from '../events/events.entity';
import { CommentEntity } from '../../modules/comments/comment.entity';
import { ProjectEntity } from '../../modules/projects/project.entity';
import { ClientEntity } from '../client/client.entity';
import { NewsEntity } from '../news/news.entity';
import { TrainingEntity } from '../../modules/training/training.entity';
import { CitiesEntity } from '../cities/cities.entity';
import { AgenciesEntity } from '../../modules/agencies/agencies.entity';
import { UserDto } from './dtos/user.dto';
import { UseDto } from '../../decorators';

export enum UserRegisterStatus {
  CREATED = 'start',
  FILLED = 'filled',
  FINISHED = 'finished',
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  username!: string;

  @Column({ nullable: true, type: 'varchar' })
  password!: string;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'date' })
  birthDate!: Date | null;

  @Column({ nullable: true, type: 'date' })
  workStartDate!: Date | null;

  @Column({ nullable: true, type: 'int' })
  verification_code!: number | null;

  @Column({ nullable: true, type: 'timestamp' })
  verification_code_sent_date!: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({
    type: 'enum',
    enum: UserRegisterStatus,
    default: null,
  })
  register_status!: UserRegisterStatus | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @Column({ default: false })
  isPhoneVerified?: boolean;

  @Column({ nullable: true, type: 'varchar' })
  temporaryNumber!: string | null;

  @Column({ default: true })
  status!: boolean;

  @OneToMany(() => EventsEntity, (eventsEntity) => eventsEntity.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  events?: EventsEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments?: CommentEntity[];

  @OneToMany(() => NewsEntity, (news) => news.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  news?: NewsEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  projects?: ProjectEntity[];

  @OneToMany(() => ClientEntity, (client) => client.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  clients?: ClientEntity[];

  @OneToMany(() => TrainingEntity, (train) => train.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  trainings?: TrainingEntity[];

  @ManyToOne(() => CitiesEntity, (citiesEntity) => citiesEntity.users, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'city_id' })
  city!: CitiesEntity;

  @Column({ nullable: true })
  city_id?: string;

  @ManyToOne(() => AgenciesEntity, (agency) => agency.user)
  @JoinColumn({ name: 'agency_id' })
  agency!: AgenciesEntity;

  @Column({ nullable: true })
  agency_id?: string;
}
