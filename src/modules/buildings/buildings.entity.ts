import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { ManyToOne , Column, Entity, OneToMany  } from "typeorm";
import { Uuid } from "boilerplate.polyfill";
import { ApartmentEntity } from "../../modules/apartments/apartment.entity";
import { StorageEntity } from "../../modules/storage/storage.entity";
import { CommercialBuildingsEntity } from "../../modules/commercial-buildings/commercial.entity";
import { CarParkingEntity } from "../../modules/car-parkings/carParking.entity";
import { UseDto } from "../../decorators";
import { CreateBuilding } from "./dtos/building.create.dto";

@Entity( { name : "buildings"})
@UseDto(CreateBuilding)

export class BuildingsEntity extends AbstractEntity {

  @Column()
  name !: string; 

  // storage 
  @Column( { nullable : true })
  totalStorage !: number 

  // vacant storage 
  @Column({ nullable : true })
  totalVacantStorage !: number 


  // total parking space 
  @Column( { nullable : true } )
  totalParkingSpace !: number 

  // total vacant parking space 
  @Column( { nullable : true } )
  totalVacantParkingSpace !: number 


  // commercial
  @Column( { nullable : true } )
  totalCommercial !: number 

  // vacant commercail
  @Column( { nullable : true } )
  totalVacantCommercial !: number  

  @Column( { nullable : true } )
  address !: string 

  @Column( { nullable : true } )
  numberOfFloors !: number 

  @Column({type: 'text', array: true, nullable: true })
  photos: string[] = [];

  @Column({ type: 'uuid' })
  projectId !: Uuid;
  
  @ManyToOne(() => ProjectEntity, project => project.buildings , {
      onDelete :"CASCADE",
      onUpdate : "CASCADE"
  })
  project !: ProjectEntity;




  //Apartments
  @OneToMany(() => ApartmentEntity , ( apartment ) => apartment.building , {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  } )
  apartments ? : ApartmentEntity[]


   // storage places 
   @OneToMany(() => StorageEntity , storage => storage.building , {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
   })
   storages ? : StorageEntity[]


   // car parking places 
   @OneToMany(() =>  CarParkingEntity , carParking => carParking.building , {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
   })
   carParkings ? : CarParkingEntity[]



   //commercial places 
   @OneToMany(() => CommercialBuildingsEntity , ( commercial )  => commercial.building , {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
   })

   commercialBuildings ? : CommercialBuildingsEntity

}
