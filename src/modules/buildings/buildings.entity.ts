import { AbstractEntity } from '../../common/abstract.entity';
import { ProjectEntity } from '../../modules/projects/project.entity';
import { ManyToOne, Column, Entity, OneToMany, JoinColumn } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { PremisesEntity } from '../premises/premises.entity';
import { SectionsEntity } from '../sections/sections.entity';

@Entity({ name: 'buildings' })
export class BuildingsEntity extends AbstractEntity {
  @Column()
  name!: string;

  // storage
  @Column({ nullable: true })
  totalStorage!: number;

  // vacant storage
  @Column({ nullable: true })
  totalVacantStorage!: number;

  // total parking space
  @Column({ nullable: true })
  totalParkingSpace!: number;

  // total vacant parking space
  @Column({ nullable: true })
  totalVacantParkingSpace!: number;

  // commercial
  @Column({ nullable: true })
  totalCommercial!: number;

  // vacant commercail
  @Column({ nullable: true })
  totalVacantCommercial!: number;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  numberOfFloors!: number;

  @Column({ type: 'text', array: true, nullable: true })
  photos: string[] = [];

  @Column({ type: 'uuid' })
  projectId!: Uuid;

  @ManyToOne(() => ProjectEntity, (project) => project.buildings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project!: ProjectEntity;

  @OneToMany(() => PremisesEntity, (Premises) => Premises.building)
  premises?: PremisesEntity[];

  @ManyToOne(
    () => SectionsEntity,
    (SectionsEntity) => SectionsEntity.buildings,
    {
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'section_id' })
  section!: SectionsEntity;

  @Column({ nullable: true })
  section_id?: string;
}
