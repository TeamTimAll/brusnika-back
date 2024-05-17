import { UseDto } from "../../decorators";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProjectSDto } from "./dto/projects.dto";
import { Uuid } from "boilerplate.polyfill";
import { UserEntity } from "../../modules/user/user.entity";
import { AbstractEntity } from "../../common/abstract.entity";

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



}
