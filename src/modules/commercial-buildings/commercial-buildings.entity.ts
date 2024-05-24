import { AbstractEntity } from "../../common/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";



@Entity({ name : "commercial_buildings"})
export class CommercialBuildingsEntity extends AbstractEntity {

    @Column()
    buildingId !: string 

    @ManyToOne(() => BuildingsEntity, building => building.commercialBuildings)
    building !: BuildingsEntity;
    
}