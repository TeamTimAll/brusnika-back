
import { Column, Entity, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { AgenciesDto } from './dtos/agencies.dto';
import { Uuid } from 'boilerplate.polyfill';

@Entity({ name: 'Agencies' })
@UseDto(AgenciesDto)

export class AgenciesEntity extends AbstractEntity<AgenciesDto> {
  @Column({ type: 'uuid' })
  userId!: Uuid;

  // @ManyToOne(() => UserEntity, (userEntity) => userEntity.Agencies, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ nullable: true, type: 'varchar' })
  title!: string;

  @Column({ nullable: true, type: 'varchar' })
  description!: string;

  @Column({ nullable: true, type: 'varchar' })
  photo!: string;

}
