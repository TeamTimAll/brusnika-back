import { RoleType } from "../constants";

export interface ICurrentUser {
	user_id: number;
	username?: string;
	email?: string;
	role?: RoleType;
}
