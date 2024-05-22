import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { PremisesEntity } from "../../modules/premises/premise.entity";




@Entity({ name : "apartments"})
export class ApartmentEntity extends AbstractEntity {

       @Column()
       premiseId !: string 

       @ManyToOne(() => PremisesEntity , premise => premise.apartments)
       premise  !: PremisesEntity


       @Column()
       size !: number 

       @Column()
       price !: number 

       @Column()
       floor !: number 

}



