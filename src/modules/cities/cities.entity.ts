import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { CitiesDto } from './dtos/cities.dto';

@Entity({ name: 'Cities' })
@UseDto(CitiesDto)
export class CitiesEntity extends AbstractEntity<CitiesDto> {
  @Column({ nullable: true, type: 'varchar' })
  name!: string;
}
