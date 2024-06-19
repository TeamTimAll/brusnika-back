import { Uuid } from "boilerplate.polyfill";

export interface ICurrentUser {
	id: Uuid;
	username?: string;
	email?: string;
	roles?: string[];
}
