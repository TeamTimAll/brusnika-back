import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { Entity } from "typeorm";
import { TraningDto } from "./dtos/training.dto";
import { UserEntity } from "../../modules/user/user.entity";
import { Column , ManyToOne , JoinColumn } from "typeorm";

@Entity( { name : "traning"})
@UseDto(TraningDto)
export class TrainingEntity extends AbstractEntity <TraningDto>{

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.news, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })

    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;


    @Column({ nullable : false , type : "varchar"})
    title !: string

    @Column({ nullable : false , type : "varchar"})
    description !: string

    @Column({ nullable : false , type : "varchar"})
    imageUrl !: string


}

