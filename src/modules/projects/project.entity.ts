import { UseDto } from "../../decorators";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProjectSDto } from "./dto/projects.dto";
import { Uuid } from "boilerplate.polyfill";
import { UserEntity } from "../../modules/user/user.entity";
import { AbstractEntity } from "../../common/abstract.entity";
import { ClientEntity } from "../clients/client.entity"

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
      
    @Column({ nullable: false })
    title!: string 

    @Column({ nullable: false }) 
    description!: string 


    @OneToMany(()=> ClientEntity , (  client ) => client.project )
    clients ? : ClientEntity[] // project clients 

}
