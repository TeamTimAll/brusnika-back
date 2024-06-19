import { Uuid } from "boilerplate.polyfill";

import { RoleType } from "../constants";

export interface ICurrentUser {
	user_id: Uuid;
	username?: string;
	email?: string;
	role?: RoleType;
}
