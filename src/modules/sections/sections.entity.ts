import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { SectionsDto } from './dtos/sections.dto';
import { ProjectEntity } from '../projects/project.entity';
import { BuildingsEntity } from '../buildings/buildings.entity';

@Entity({ name: 'sections' })
@UseDto(SectionsDto)
export class SectionsEntity extends AbstractEntity<SectionsDto> {
  @Column({ nullable: true, type: 'varchar' })
  name!: string;

  @ManyToOne(() => ProjectEntity, (ProjectEntity) => ProjectEntity.sections, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @Column({ nullable: true })
  project_id?: string;

  @OneToMany(() => BuildingsEntity, (BuildingsEntity) => BuildingsEntity.section)
  buildings?: BuildingsEntity[];
}
