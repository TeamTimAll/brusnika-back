import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { Column  , Entity, ManyToOne} from "typeorm";



@Entity({ name : "storages"})
export class StorageEntity extends AbstractEntity {

    @Column()
    projectId !:string 

    @ManyToOne(() => ProjectEntity , ( project ) => project.storages )
    project !: ProjectEntity

    @Column()
    title !: string 
}




