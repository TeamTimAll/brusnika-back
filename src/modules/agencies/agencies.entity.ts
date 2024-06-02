
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { AgenciesDto } from './dtos/agencies.dto';
import { CitiesEntity } from '../cities/cities.entity';

@Entity({ name: 'agencies' })
@UseDto(AgenciesDto)
export class AgenciesEntity extends AbstractEntity<AgenciesDto> {
  @OneToMany(() => UserEntity, (userEntity) => userEntity.agency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ nullable: true, type: 'varchar' })
  title!: string;

  @ManyToOne(() => CitiesEntity, (citiesEntity) => citiesEntity.users, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'city_id' })
  city!: CitiesEntity;

  @Column({ nullable: true })
  city_id?: string;

  @Column({ nullable: true, type: 'varchar' })
  legalName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  inn!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  ownerFullName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  ownerPhone!: string | null;

  // @Column({ nullable: true, type: 'varchar' })
  // description!: string;

  // @Column({ nullable: true, type: 'varchar' })
  // photo!: string;

}
