import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { NewsDto } from "./dto/news.dto";
import { Uuid } from 'boilerplate.polyfill';

export enum NEWS_CATEGORIES {
  Politics = 'POLITICS',
  Sports = 'SPORTS',
  Technology = 'TECHNOLOGY',
  Entertainment = 'ENTERTAINMENT',
}


@Entity({ name: 'news' })
@UseDto(NewsDto)
export class NewsEntity extends AbstractEntity<NewsDto> {

  @Column({ type: 'uuid' })
  userId!: Uuid;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.news, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ nullable: true, type: 'varchar' })
  title!: string;

  @Column({ nullable: true, type: 'text' })
  content!: string;

  @Column({ nullable: true, type: 'varchar' })
  coverImage!: string;

  @Column({
    type: 'enum',
    enum: NEWS_CATEGORIES,
    nullable: false,
  })
  category!: NEWS_CATEGORIES;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ default: 0 })
  views!: number;
 
}
