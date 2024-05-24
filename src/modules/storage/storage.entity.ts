import { AbstractEntity } from "../../common/abstract.entity";
import { Column  , Entity, ManyToOne} from "typeorm";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";


@Entity({ name : "storages"})
export class StorageEntity extends AbstractEntity {

    @Column()
    buildingId !:string 

    @ManyToOne(() => BuildingsEntity , ( building ) => building.storages , {
         onDelete : "CASCADE",
         onUpdate : "CASCADE"
    })

    building !: BuildingsEntity

    @Column()
    title !: string 
}




