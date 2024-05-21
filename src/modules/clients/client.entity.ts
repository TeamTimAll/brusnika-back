import { Entity, Column, JoinColumn, ManyToOne  } from 'typeorm';
import { UseDto } from '../../decorators';
import { ClientDto, PinningType } from './dto/client.dto';
import { UserEntity } from '../../modules/user/user.entity';
import { Uuid } from 'boilerplate.polyfill';
import { ProjectEntity } from '../projects/project.entity';
import { AbstractEntity } from '../../common/abstract.entity';




@Entity({ name: 'clients' })
@UseDto(ClientDto)
export class ClientEntity  extends AbstractEntity <ClientDto>  {
  
  @Column({ type: 'varchar', length: 255 , nullable : true  })
  fullName!: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'varchar', length: 15 , nullable : true  })
  phoneNumber!: string;

  @Column({ type: 'varchar', nullable: true })
  transactionStatus?: string;

  @Column({ type: 'varchar', nullable: true })
  transactionStage?: string;

  @Column({ type: 'timestamp' , nullable : true  })
  establishmentDate!: Date;

  @Column({ type: 'enum', enum: PinningType , nullable : true  })
  pinningType ? : PinningType;

  @Column({ type: 'int' , nullable : true  })
  daysUntilEndOfAssignment!: number;

  @Column({ type: 'text', nullable: true })
  managerNote?: string;

  @Column({ type: 'uuid' , nullable : true  })
  userId!: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  
  @JoinColumn()
  user!: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  projectId!: Uuid;

  @ManyToOne(() => ProjectEntity, (project) => project.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  
  @JoinColumn()
  project!: ProjectEntity;
}
