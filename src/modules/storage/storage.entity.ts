import { AbstractEntity } from "common/abstract.entity";
import { ProjectEntity } from "modules/projects/project.entity";
import { Column  , ManyToOne} from "typeorm";



export class StorageEntity extends AbstractEntity {

    @Column()
    projectId !:string 

    @ManyToOne(() => ProjectEntity , ( project ) => project.storages )
    project !: ProjectEntity

    @Column()
    title !: string 
}




