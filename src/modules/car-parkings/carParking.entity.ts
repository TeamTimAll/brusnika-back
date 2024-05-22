import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";





@Entity({ name : "parking_space"})
export class CarParkingEntity extends AbstractEntity {
      

    @Column()
    projectId !: string 

    @ManyToOne(() => ProjectEntity , project => project.carParkings)
    project !: ProjectEntity


}