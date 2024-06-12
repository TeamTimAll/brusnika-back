import { UserRegisterStatus } from "../user/user.entity";

interface IUserRegisterStatusRuleMap {
	from_dt_status: UserRegisterStatus;
	to_dt_status: UserRegisterStatus;
	is_accessible: boolean;
}

type StatusEvent = <T>() => T;

interface IStatusRuleEventMap {
	from_status: UserRegisterStatus;
	to_status: UserRegisterStatus;
	event?: StatusEvent;
	onErrorEvent?: StatusEvent;
}

export class UserStatusDecisionTable {
	constructor() {}

	private UserRegisterStatusRuleMap: IUserRegisterStatusRuleMap[] = [
		// Draft rule
		{
			from_dt_status: UserRegisterStatus.DRAFT,
			to_dt_status: UserRegisterStatus.DRAFT,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.DRAFT,
			to_dt_status: UserRegisterStatus.CREATED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.DRAFT,
			to_dt_status: UserRegisterStatus.FILLED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.DRAFT,
			to_dt_status: UserRegisterStatus.FINISHED,
			is_accessible: true,
		},
		// Create rule
		{
			from_dt_status: UserRegisterStatus.CREATED,
			to_dt_status: UserRegisterStatus.CREATED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.CREATED,
			to_dt_status: UserRegisterStatus.FILLED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.CREATED,
			to_dt_status: UserRegisterStatus.FINISHED,
			is_accessible: false,
		},
		{
			from_dt_status: UserRegisterStatus.CREATED,
			to_dt_status: UserRegisterStatus.DRAFT,
			is_accessible: true,
		},
		// In progress rule
		{
			from_dt_status: UserRegisterStatus.FILLED,
			to_dt_status: UserRegisterStatus.CREATED,
			is_accessible: false,
		},
		{
			from_dt_status: UserRegisterStatus.FILLED,
			to_dt_status: UserRegisterStatus.FILLED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.FILLED,
			to_dt_status: UserRegisterStatus.FINISHED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.FILLED,
			to_dt_status: UserRegisterStatus.DRAFT,
			is_accessible: true,
		},
		// Complete rule
		{
			from_dt_status: UserRegisterStatus.FINISHED,
			to_dt_status: UserRegisterStatus.CREATED,
			is_accessible: false,
		},
		{
			from_dt_status: UserRegisterStatus.FINISHED,
			to_dt_status: UserRegisterStatus.FILLED,
			is_accessible: false,
		},
		{
			from_dt_status: UserRegisterStatus.FINISHED,
			to_dt_status: UserRegisterStatus.FINISHED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus.FINISHED,
			to_dt_status: UserRegisterStatus.DRAFT,
			is_accessible: true,
		},
	];

	private StatusRuleEventMap: IStatusRuleEventMap[] = [
		// Draft rule
		{
			from_status: UserRegisterStatus.DRAFT,
			to_status: UserRegisterStatus.DRAFT,
		},
		{
			from_status: UserRegisterStatus.DRAFT,
			to_status: UserRegisterStatus.CREATED,
		},
		{
			from_status: UserRegisterStatus.DRAFT,
			to_status: UserRegisterStatus.FILLED,
		},
		{
			from_status: UserRegisterStatus.DRAFT,
			to_status: UserRegisterStatus.FINISHED,
		},
		// Create rule
		{
			from_status: UserRegisterStatus.CREATED,
			to_status: UserRegisterStatus.CREATED,
		},
		{
			from_status: UserRegisterStatus.CREATED,
			to_status: UserRegisterStatus.FILLED,
		},
		{
			from_status: UserRegisterStatus.CREATED,
			to_status: UserRegisterStatus.FINISHED,
		},
		{
			from_status: UserRegisterStatus.CREATED,
			to_status: UserRegisterStatus.DRAFT,
		},
		// In progress rule
		{
			from_status: UserRegisterStatus.FILLED,
			to_status: UserRegisterStatus.CREATED,
		},
		{
			from_status: UserRegisterStatus.FILLED,
			to_status: UserRegisterStatus.FILLED,
		},
		{
			from_status: UserRegisterStatus.FILLED,
			to_status: UserRegisterStatus.FINISHED,
		},
		{
			from_status: UserRegisterStatus.FILLED,
			to_status: UserRegisterStatus.DRAFT,
		},
		// Complete rule
		{
			from_status: UserRegisterStatus.FINISHED,
			to_status: UserRegisterStatus.CREATED,
		},
		{
			from_status: UserRegisterStatus.FINISHED,
			to_status: UserRegisterStatus.FILLED,
		},
		{
			from_status: UserRegisterStatus.FINISHED,
			to_status: UserRegisterStatus.FINISHED,
		},
		{
			from_status: UserRegisterStatus.FINISHED,
			to_status: UserRegisterStatus.DRAFT,
		},
	];

	public setEvent(rule: IStatusRuleEventMap) {
		const foundStatusRule = this.StatusRuleEventMap.find(
			(s) =>
				s.from_status === rule.from_status &&
				s.to_status === rule.to_status,
		);
		if (typeof foundStatusRule === "undefined") {
			throw new Error("status rule not implemented");
		}
		foundStatusRule.event = rule.event;
		foundStatusRule.onErrorEvent = rule.onErrorEvent;
	}

	private statusEventHandler(
		fromStatus?: UserRegisterStatus,
		toStatus?: UserRegisterStatus,
	) {
		const foundStatusRule = this.StatusRuleEventMap.find(
			(s) => s.from_status === fromStatus && s.to_status === toStatus,
		);
		if (typeof foundStatusRule === "undefined") {
			throw new Error("status rule not implemented");
		}
		return foundStatusRule;
	}

	statusSwitcher(
		formDTStatus: UserRegisterStatus,
		toDTStatus: UserRegisterStatus,
	) {
		const foundRule = this.UserRegisterStatusRuleMap.find(
			(dts) =>
				dts.from_dt_status === formDTStatus &&
				dts.to_dt_status === toDTStatus,
		);

		if (typeof foundRule === "undefined") {
			throw new Error("Rule not implemented!");
		}

		const handler = this.statusEventHandler(
			foundRule.from_dt_status,
			foundRule.to_dt_status,
		);
		if (foundRule.is_accessible) {
			if (handler.event) {
				return handler.event();
			}
		} else {
			if (handler.onErrorEvent) {
				return handler.onErrorEvent();
			}
		}
	}
}
