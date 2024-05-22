import { AbstractEntity } from "common/abstract.entity";
import { ProjectEntity } from "modules/projects/project.entity";
import { Column, ManyToOne } from "typeorm";




export class CommercialBuildingsEntity extends AbstractEntity {

    @Column()
    projectId !: string 

    @ManyToOne(() => ProjectEntity, project => project.commercialBuildings)
    project !: ProjectEntity
}