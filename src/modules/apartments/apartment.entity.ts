import { Column, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "modules/projects/project.entity";




export class ApartmentEntity extends AbstractEntity {


       @Column()
       projectId !: string 

       @ManyToOne(() => ProjectEntity , project => project.apartments)
       project !: ProjectEntity
}