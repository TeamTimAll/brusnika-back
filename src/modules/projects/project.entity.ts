import { UseDto } from "../../decorators";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProjectSDto } from "./dto/projects.dto";
import { Uuid } from "boilerplate.polyfill";
import { UserEntity } from "../../modules/user/user.entity";
import { AbstractEntity } from "../../common/abstract.entity";
import { ClientEntity } from "../clients/client.entity"
import { PremisesEntity } from "../../modules/premises/premise.entity";


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

    @OneToMany(() => PremisesEntity, premises => premises.project)
    premises ?: PremisesEntity[];

}
