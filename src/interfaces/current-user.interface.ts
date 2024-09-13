import { RoleType } from "../constants";

export interface ICurrentUser {
	user_id: number;
	username?: string | null;
	email?: string | null;
	role: RoleType;
	firebase_token?: string;
	analytics_id?: number;
}
