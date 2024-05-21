import { AbstractEntity } from "common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { ManyToOne , Column, Entity  } from "typeorm";




@Entity()
export class PremisesEntity extends AbstractEntity {

  @Column({
    type: 'enum',
    enum: ['apartment', 'parking', 'storage', 'commercial'],
  })
  
  type !: 'apartment' | 'parking' | 'storage' | 'commercial';

  @Column()
  name !: string; 

  @Column()
  totalAvailable !: number;

  @Column()
  totalVacant !: number;

  @ManyToOne(() => ProjectEntity, project => project.premises)
  project !: ProjectEntity;


}
