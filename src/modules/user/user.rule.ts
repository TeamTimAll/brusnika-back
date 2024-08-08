import { IRule } from "interfaces/rule.inteface";

import { RoleType } from "../../constants";

export const UserChangeRoleRule: IRule = {
	[RoleType.USER]: undefined,
	[RoleType.ADMIN]: undefined,
	[RoleType.AGENT]: undefined,
	[RoleType.MANAGER]: undefined,
	[RoleType.EMPLOYEE]: undefined,
	[RoleType.NEW_MEMBER]: undefined,
	[RoleType.HEAD_OF_AGENCY]: {
		[RoleType.NEW_MEMBER]: true,
	},
	[RoleType.OZK_MANAGER]: undefined,
	[RoleType.AFFILIATE_MANAGER]: undefined,
};
