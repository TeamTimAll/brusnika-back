import { UseDto } from "../../decorators";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProjectSDto } from "./dto/projects.dto";
import { Uuid } from "boilerplate.polyfill";
import { UserEntity } from "../../modules/user/user.entity";
import { AbstractEntity } from "../../common/abstract.entity";
import { ClientEntity } from "../clients/client.entity"
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";
import { StorageEntity } from "../../modules/storage/storage.entity";
import { CarParkingEntity } from "../../modules/car-parkings/carParking.entity";
import { CommercialBuildingsEntity } from "../../modules/commercial-buildings/commercial-buildings.entity";

@Entity( { name : "projects"})
@UseDto(ProjectSDto)
export class ProjectEntity extends AbstractEntity<ProjectSDto> {
   

    @Column({ type: 'uuid' })
    userId!: Uuid;

    @ManyToOne(() => UserEntity, (user) => user.projects, { 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })

    @JoinColumn({ name: 'user_id' })
    user!: UserEntity; 
    
    @Column({ nullable: true  })
    name !: string 

    @Column({ nullable: true  }) 
    detailedDescription!: string 

    @Column({ nullable: true  }) 
    briefDescription!: string 

    @Column({ nullable :true  })
    photo !: string 

    @OneToMany(()=> ClientEntity , (  client ) => client.project )
    clients ? : ClientEntity[] 

    @OneToMany(() => BuildingsEntity, buildings => buildings.project)
    premises ?: BuildingsEntity[];

    //new added

    //price 
    @Column({ nullable : true })
    price !:number 

    //location
    @Column( { nullable : true })
    location !: string  

    //end date 
    @Column({ nullable : true })
    endDate !: Date 

    // storage places 
    @OneToMany(() => StorageEntity , storage => storage.project)
    storages ? : StorageEntity[]



    // car parking places 
    @OneToMany(() =>  CarParkingEntity , carParking => carParking.project)
    carParkings ? : CarParkingEntity[]



    //commercial premises 
    @OneToMany(() => CommercialBuildingsEntity , ( buildings )  => buildings.project )
    commercialBuildings ? : CommercialBuildingsEntity

    

}
