import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { Column, Entity, ManyToOne } from "typeorm";




@Entity({ name : "commercial_buildings"})
export class CommercialBuildingsEntity extends AbstractEntity {

    @Column()
    projectId !: string 

    @ManyToOne(() => ProjectEntity, project => project.commercialBuildings)
    project !: ProjectEntity
}