import { Column, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "modules/projects/project.entity";





export class CarParkingEntity extends AbstractEntity {
      

    @Column()
    projectId !: string 

    @ManyToOne(() => ProjectEntity , project => project.carParkings)
    project !: ProjectEntity

    
}