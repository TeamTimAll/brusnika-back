import { IRule } from "interfaces/rule.inteface";

import { RoleType } from "../../constants";

export const UserChangeRoleRule: IRule = {
	[RoleType.ADMIN]: undefined,
	[RoleType.AGENT]: {
		[RoleType.AGENT]: true,
	},
	[RoleType.MANAGER]: undefined,
	[RoleType.NEW_MEMBER]: undefined,
	[RoleType.HEAD_OF_AGENCY]: {
		[RoleType.NEW_MEMBER]: true,
	},
	[RoleType.OPERATOR]: undefined,
	[RoleType.AFFILIATE_MANAGER]: undefined,
};
