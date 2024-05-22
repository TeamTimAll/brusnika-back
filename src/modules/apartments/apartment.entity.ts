import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";




@Entity({ name : "apartments"})
export class ApartmentEntity extends AbstractEntity {


       @Column()
       projectId !: string 

       @ManyToOne(() => ProjectEntity , project => project.apartments)
       project !: ProjectEntity
}