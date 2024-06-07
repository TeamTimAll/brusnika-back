import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { PremisesDto } from './dtos/premises.dto';
import { BuildingsEntity } from '../buildings/buildings.entity';

export enum PremisesType {
  APARTMENT = 'apartment',
  STOREROOM = 'storeroom',
  PARKING = 'parking',
  COMMERCIAL = 'commercial',
}

export enum CommercialStatus {
  FREE = 'free',
  TAKEN = 'taken',
}

@Entity({ name: 'premises' })
// @UseDto(PremisesDto)
export class PremisesEntity extends AbstractEntity<PremisesDto> {
  @Column({ nullable: true, type: 'varchar' })
  name!: string;

  @Column({ nullable: false, type: 'enum', enum: PremisesType })
  type!: PremisesType;

  @ManyToOne(
    () => BuildingsEntity,
    (BuildingsEntity) => BuildingsEntity.premises,
    {
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'building_id' })
  building!: BuildingsEntity;

  @Column({ nullable: true })
  building_id?: string;

  @Column({ nullable: true, type: 'varchar' })
  price!: number;

  @Column({ nullable: true, type: 'varchar' })
  size!: number;

  @Column({ nullable: true })
  status!: CommercialStatus;

  @Column({ nullable: true, type: 'varchar' })
  number!: number;

  @Column({ nullable: true })
  floor!: number;

  @Column({ nullable: true })
  photo!: string;

  @Column({ nullable: true })
  rooms!: number;

  @Column({ type: 'text', array: true, nullable: true })
  photos: string[] = [];

  @Column({ nullable: true })
  similiarApartmentCount!: number;

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true, type: 'date' })
  end_date!: Date;

  @Column({ nullable: true })
  mortagePayment!: number;
}
