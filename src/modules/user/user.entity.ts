import { Column, Entity, OneToMany, OneToOne, VirtualColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { UserDto } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';
import { EventsEntity } from '../events/events.entity';
import { CommentEntity } from '../../modules/comments/comment.entity';
import { ProjectEntity } from '../../modules/projects/project.entity';



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
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  verification_code!: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  verification_code_sent_date!: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })

  fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @OneToMany(() => EventsEntity, (eventsEntity) => eventsEntity.user)
  events?: EventsEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments?: CommentEntity[]; 


  @OneToMany(() => ProjectEntity ,( project ) => project.user)
  projects ?: ProjectEntity[]

}


