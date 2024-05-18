
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { EventsDto } from './dtos/events.dto';
import { Uuid } from 'boilerplate.polyfill';
import { CommentEntity } from "../comments/comment.entity"

export enum EVENT_TYPES {
  Banner = 'BANNER',
  News = 'NEWS',
}

@Entity({ name: 'events' })
@UseDto(EventsDto)

export class EventsEntity extends AbstractEntity<EventsDto> {
  @Column({ type: 'uuid' })
  userId!: Uuid;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ nullable: true, type: 'varchar' })
  title!: string;

  @Column({ nullable: true, type: 'varchar' })
  description!: string;

  @Column({ nullable: true, type: 'varchar' })
  photo!: string;

  @Column({
    type: 'enum',
    enum: EVENT_TYPES,
    nullable: false,
  })
  
  type!: EVENT_TYPES;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ default: 0 })
  views!: number; 

  @OneToMany(() => CommentEntity, (comment) => comment.event)
  comments?: CommentEntity[]; // One-to-many relationship with comments
}
