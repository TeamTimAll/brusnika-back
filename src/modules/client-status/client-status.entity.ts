import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { ClientStatusDto } from './dto/client.status.dto';
import { Uuid } from 'boilerplate.polyfill';
import { ClientEntity } from '../../modules/client/client.entity';
import { IStatusType } from 'types/client.types';

@Entity({ name: 'client_status' })
export class ClientStatusEntity extends AbstractEntity<ClientStatusDto> {
  @Column({ type: 'varchar' })
  type!: IStatusType;

  @Column({ type: 'uuid' })
  clientId!: Uuid;

  @OneToOne(() => ClientEntity, client => client.pinningType)
  @JoinColumn({ name: 'client_id' })
  client!: ClientEntity;
  
}
