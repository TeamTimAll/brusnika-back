import { Uuid } from 'boilerplate.polyfill';

export interface ICurrentUser {
  user_id: Uuid;
  username?: string;
  email?: string;
  roles?: string[];
}
