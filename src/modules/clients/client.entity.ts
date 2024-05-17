import { AbstractEntity } from '../../common/abstract.entity';
import { Entity, Column } from 'typeorm';
import { UseDto } from '../../decorators';
import { ClientDto, PinningType } from './dto/client.dto';
// import { ProjectEntity } from  "./"

@Entity({ name: 'clients' })
@UseDto(ClientDto)
export class ClientEntity extends AbstractEntity {
  
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

  @Column({ type: 'enum', enum: PinningType })
  pinningType!: PinningType;

  @Column({ type: 'int' })
  daysUntilEndOfAssignment!: number;

  @Column({ type: 'text', nullable: true })
  managerNote?: string;
}
