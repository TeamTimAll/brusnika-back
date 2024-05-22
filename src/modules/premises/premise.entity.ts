import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { ManyToOne , Column, Entity, OneToMany  } from "typeorm";
import { Uuid } from "boilerplate.polyfill";
import { ApartmentEntity } from "../../modules/apartments/apartment.entity";




@Entity( { name : "premises"})
export class PremisesEntity extends AbstractEntity {

  @Column()
  name !: string; 

  // storage 
  @Column( { nullable : true })
  totalStorage !: number 

  // vacant storage 
  @Column({ nullable : true })
  totalVacantStorage !: number 

  // apartment 
  @Column( { nullable : true } )
  totalApartment !: number 

  // vacant apartment 
  @Column( { nullable : true } )
  totalVacantApartment !: number 

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

  @ManyToOne(() => ProjectEntity, project => project.premises)
  project !: ProjectEntity;

  @Column({ type: 'uuid' })
  projectId !: Uuid;


  @OneToMany(() => ApartmentEntity , ( apartment ) => apartment.premise )
  apartments ? : ApartmentEntity[]



}
