import { Entity, Column, JoinColumn, OneToOne, ManyToOne, DeleteDateColumn } from 'typeorm';
import { UseDto } from '../../decorators';
import { ClientDto } from './dto/client.dto';
import { UserEntity } from '../user/user.entity';
import { Uuid } from 'boilerplate.polyfill';
import { ProjectEntity } from '../projects/project.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { ClientStatusEntity } from '../../modules/client-status/client-status.entity';

@Entity({ name: 'clients' })
@UseDto(ClientDto)
export class ClientEntity extends AbstractEntity<ClientDto> {
  
  @Column({ type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'varchar', length: 15 })
  phoneNumber!: string;

  @Column({ type: 'varchar', nullable: true })
  transactionStatus?: string;

  @Column({ type: 'varchar', nullable: true })
  transactionStage?: string;

  @Column({ type: 'timestamp' })
  establishmentDate!: Date;

  @OneToOne(() => ClientStatusEntity, clientStatus => clientStatus.client)
  @JoinColumn({ name: 'client_status_id' }) 
  pinningType!: ClientStatusEntity;

  @Column({ type: 'int' })
  daysUntilEndOfAssignment!: number;

  @Column({ type: 'text', nullable: true })
  managerNote?: string;

  @Column({ type: 'uuid' })
  userId!: Uuid;

  @ManyToOne(() => UserEntity, user => user.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  projectId!: Uuid;

  @ManyToOne(() => ProjectEntity, project => project.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @DeleteDateColumn()
  deletedAt?: Date;
}
