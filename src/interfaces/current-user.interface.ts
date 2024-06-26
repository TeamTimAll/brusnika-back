import { RoleType } from "../constants";

export interface ICurrentUser {
	user_id: string;
	username?: string;
	email?: string;
	role?: RoleType;
}
