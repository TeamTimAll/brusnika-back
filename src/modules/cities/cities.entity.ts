import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { CitiesDto } from './dtos/cities.dto';
import { UserEntity } from '../../modules/user/user.entity';

@Entity({ name: 'Cities' })
@UseDto(CitiesDto)
export class CitiesEntity extends AbstractEntity<CitiesDto> {
  @Column({ nullable: true, type: 'varchar' })
  name!: string;

  @OneToMany(() => UserEntity, (user) => user.cityId)
  users?: UserEntity[];
}
