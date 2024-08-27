import { RoleType } from "../../constants";

type IRule = {
	[role in RoleType]?: {
		[otherRole in RoleType]?: boolean;
	};
};

export const EventRule: IRule = {
	[RoleType.ADMIN]: undefined,
	[RoleType.AGENT]: undefined,
	[RoleType.MANAGER]: undefined,
	[RoleType.NEW_MEMBER]: undefined,
	[RoleType.HEAD_OF_AGENCY]: undefined,
	[RoleType.OZK_MANAGER]: undefined,
	[RoleType.AFFILIATE_MANAGER]: undefined,
};
