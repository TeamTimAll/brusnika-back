import { AbstractDto } from "common/dto/abstract.dto";
import { UseDto } from "decorators";
import { Entity } from "typeorm";
import { ProjectSDto } from "./dto/projects.dto";
import { ManyToOne , JoinColumn  , Column} from "typeorm";
import { Uuid } from "boilerplate.polyfill";
import { UserEntity } from "modules/user/user.entity";


@Entity("projects")
@UseDto(ProjectSDto)

export class ProjectEntity extends AbstractDto {

    @Column({ type: 'uuid' })
    userId!: Uuid;

    @ManyToOne( ( ) => UserEntity  , ( user ) => user.projects , { 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })


    @JoinColumn({ name: 'user_id' })
    user!: UserEntity; 
      
    @Column({ nullable : false  })
    title !: string 


    @Column({ nullable : false }) 
    description  !: string 

}
