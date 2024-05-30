import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DealsDto } from './dtos/deals.dto';
import { ProjectEntity } from '../../modules/projects/project.entity';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ClientEntity } from '../../modules/client/client.entity';

@Entity({ name: 'deals' })
@UseDto(DealsDto)
export class DealsEntity extends AbstractEntity<DealsDto> {
  @Column({ type: 'varchar' })
  projectId!: string;

  @ManyToOne(() => ProjectEntity, (project) => project.deals, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

  @Column({ type: 'varchar' })
  clientId!: string;

  @ManyToOne(() => ClientEntity, (client) => client.deals, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  client!: ClientEntity;

  @Column()
  productType!: string;

  @Column()
  clientFullName!: string;

  @Column()
  clientPhoneNumber!: string;

  @Column({ unique: true })
  transactionNumber!: string;

  @Column()
  transactionStatus!: string;

  @Column()
  transactionStage!: string;

  @CreateDateColumn()
  transactionDate!: Date;

  @UpdateDateColumn({ nullable: true })
  lastStageChangeDate!: Date;

  @Column({ nullable: true })
  newStageOnLastChange!: string; // If stage changed

  @Column({ nullable: true })
  floor!: number;

  @Column({ nullable: true })
  roomNumber!: string;

  @Column()
  cost!: number;

  @Column()
  agentName!: string;

  @Column()
  managerName!: string;

  @Column({ nullable: true })
  remuneration!: number;
}
