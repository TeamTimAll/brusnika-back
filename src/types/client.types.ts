import { Uuid } from 'boilerplate.polyfill';
import { ClientStatusEntity } from 'modules/client-status/client-status.entity';

export type IClientStatusCreatedType = {
  success: boolean;
  error_reason?: string;
  clientStatus?: ClientStatusEntity;
};

export type IStatusType =
  | 'lead verification'
  | 'refusal to secure'
  | ' weak fixation'
  | 'strong fixation';

export type IClientCreateStatus = {
  clientId: Uuid;
  type: IStatusType;
};
