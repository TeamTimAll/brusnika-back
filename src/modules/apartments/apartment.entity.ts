import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { ApartmentDto } from "./dtos/apartment.dto";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";




@Entity({ name : "apartments"})
@UseDto(ApartmentDto)
export class ApartmentEntity extends AbstractEntity {

       @Column( { nullable : true })
       buildingId !: string 

       @ManyToOne(() => BuildingsEntity , building => building.apartments , {
          onDelete :'CASCADE',
          onUpdate : "CASCADE"
       })
       building  !: BuildingsEntity

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



