import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";





@Entity({ name : "parking_space"})
export class CarParkingEntity extends AbstractEntity {
      

    @Column()
    buildingId !: string 

    @ManyToOne(() => BuildingsEntity , building => building.carParkings)
    building !: BuildingsEntity

}