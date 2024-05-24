import { AbstractEntity } from "../../common/abstract.entity";
import { Column  , Entity, ManyToOne} from "typeorm";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";


export enum CommercialStatus {
    FREE = 'free',
    TAKEN = 'taken',
  }


@Entity({ name : "commercial_buildings"})
export class CommercialBuildingsEntity extends AbstractEntity {

    @Column()
    buildingId !:string 

    @ManyToOne(() => BuildingsEntity , ( building ) => building.commercialBuildings , {
         onDelete : "CASCADE",
         onUpdate : "CASCADE"
    })
    building !: BuildingsEntity


    @Column({ nullable : true })
    price !: string 

    @Column({ nullable : true })
     size !: string 

    @Column({ nullable :true })
    status !:  CommercialStatus

    @Column({ nullable : true })
    commercialNumber    !: string 

    @Column({ nullable : true })
    floor !: number 

    @Column({ nullable : true })
    photo !: string 
}




