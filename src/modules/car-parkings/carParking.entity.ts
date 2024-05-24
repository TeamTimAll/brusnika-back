import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";
import { UseDto } from "../../decorators";
import { CarParkingDto } from "./dtos/car-parking.dto";



export enum ParkingSpaceStatus {
    FREE = 'free',
    TAKEN = 'taken',
  }



@Entity({ name : "parking_space"})
@UseDto(CarParkingDto)
export class CarParkingEntity extends AbstractEntity {

    @Column()
    buildingId !: string 

    @ManyToOne(() => BuildingsEntity , building => building.carParkings)
    building !: BuildingsEntity

    @Column( { nullable : true })
    floor !:   number 

    @Column({ nullable : true })
    parkingPlaceNumber !: string 

    @Column( { nullable : true })
    price !: string  

    @Column({
        type: "enum",
        enum: ParkingSpaceStatus,
        default: ParkingSpaceStatus.FREE, 
    })
    status!: ParkingSpaceStatus; 
   


    @Column( { nullable : true })
    photo !: string 

    
}

