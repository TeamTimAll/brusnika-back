import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { PremisesEntity } from "../../modules/premises/premise.entity";
import { UseDto } from "../../decorators";
import { ApartmentDto } from "./dtos/apartment.dto";




@Entity({ name : "apartments"})
@UseDto(ApartmentDto)
export class ApartmentEntity extends AbstractEntity {

       @Column()
       premiseId !: string 

       @ManyToOne(() => PremisesEntity , premise => premise.apartments , {
          onDelete :'CASCADE',
          onUpdate : "CASCADE"
       })
       premise  !: PremisesEntity

       @Column( { nullable : true })
       size !: string 

       @Column( { nullable : true })
       price !: string 

       @Column( { nullable : true })
       floor !: number  

       @Column( { nullable : true })
       rooms !: number  


       @Column({type: 'text', array: true, nullable: true })
       photos: string[] = [];

       @Column({ nullable : true })
       similiarApartmentCount !: number  

       @Column({ nullable : true })
       title !: string 

       @Column({ nullable : true })
       endDate !: string 

       @Column({ nullable : true })
       apartmentNumber !: number  

        @Column({ nullable : true })
        mortagePayment !:  string
}








