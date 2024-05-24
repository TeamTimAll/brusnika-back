import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { ManyToOne , Column, Entity, OneToMany  } from "typeorm";
import { Uuid } from "boilerplate.polyfill";
import { ApartmentEntity } from "../../modules/apartments/apartment.entity";




@Entity( { name : "buildings"})
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

  @ManyToOne(() => ProjectEntity, project => project.premises , {
      onDelete :"CASCADE",
      onUpdate : "CASCADE"
  })
  project !: ProjectEntity;

  @Column({ type: 'uuid' })
  projectId !: Uuid;


  @OneToMany(() => ApartmentEntity , ( apartment ) => apartment.building , {
    onDelete : "CASCADE",
    onUpdate : "CASCADE"
  } )
  apartments ? : ApartmentEntity[]

}
