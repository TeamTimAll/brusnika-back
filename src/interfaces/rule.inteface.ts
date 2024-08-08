import { RoleType } from "../constants";

export type IRule = {
	[role in RoleType]?: {
		[otherRole in RoleType]?: boolean;
	};
};
