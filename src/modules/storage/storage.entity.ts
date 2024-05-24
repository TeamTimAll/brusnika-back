import { AbstractEntity } from "../../common/abstract.entity";
import { Column  , Entity, ManyToOne} from "typeorm";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";


export enum StorageStatus {
    FREE = 'free',
    TAKEN = 'taken',
  }


@Entity({ name : "storages"})
export class StorageEntity extends AbstractEntity {

    @Column()
    buildingId !:string 

    @ManyToOne(() => BuildingsEntity , ( building ) => building.storages , {
         onDelete : "CASCADE",
         onUpdate : "CASCADE"
    })
    building !: BuildingsEntity


    @Column({ nullable : true })
    price !: string 

    @Column({ nullable : true })
     size !: string 

    @Column({ nullable :true })
    status !:  StorageStatus

    @Column({ nullable : true })
    storageNumber !: string 

    @Column({ nullable : true })
    floor !: number 

    @Column({ nullable : true })
    photo !: string 
}




