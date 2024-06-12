import { UserRegisterStatus2 } from "../user2/user2.entity";

interface IUserRegisterStatusRuleMap {
	from_dt_status: UserRegisterStatus2;
	to_dt_status: UserRegisterStatus2;
	is_accessible: boolean;
}

type StatusEvent = <T>() => T;

interface IStatusRuleEventMap {
	from_status: UserRegisterStatus2;
	to_status: UserRegisterStatus2;
	event?: StatusEvent;
	onErrorEvent?: StatusEvent;
}

export class UserStatusDecisionTable {
	constructor() {}

	private UserRegisterStatusRuleMap: IUserRegisterStatusRuleMap[] = [
		// Draft rule
		{
			from_dt_status: UserRegisterStatus2.CREATED,
			to_dt_status: UserRegisterStatus2.CREATED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus2.CREATED,
			to_dt_status: UserRegisterStatus2.FILLED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus2.CREATED,
			to_dt_status: UserRegisterStatus2.FINISHED,
			is_accessible: false,
		},
		// In progress rule
		{
			from_dt_status: UserRegisterStatus2.FILLED,
			to_dt_status: UserRegisterStatus2.CREATED,
			is_accessible: false,
		},
		{
			from_dt_status: UserRegisterStatus2.FILLED,
			to_dt_status: UserRegisterStatus2.FILLED,
			is_accessible: true,
		},
		{
			from_dt_status: UserRegisterStatus2.FILLED,
			to_dt_status: UserRegisterStatus2.FINISHED,
			is_accessible: true,
		},
		// Complete rule
		{
			from_dt_status: UserRegisterStatus2.FINISHED,
			to_dt_status: UserRegisterStatus2.CREATED,
			is_accessible: false,
		},
		{
			from_dt_status: UserRegisterStatus2.FINISHED,
			to_dt_status: UserRegisterStatus2.FILLED,
			is_accessible: false,
		},
		{
			from_dt_status: UserRegisterStatus2.FINISHED,
			to_dt_status: UserRegisterStatus2.FINISHED,
			is_accessible: true,
		},
	];

	private StatusRuleEventMap: IStatusRuleEventMap[] = [
		// DRAFT
		{
			from_status: UserRegisterStatus2.CREATED,
			to_status: UserRegisterStatus2.CREATED,
		},
		{
			from_status: UserRegisterStatus2.CREATED,
			to_status: UserRegisterStatus2.FILLED,
		},
		{
			from_status: UserRegisterStatus2.CREATED,
			to_status: UserRegisterStatus2.FINISHED,
		},
		// IN_PROGRESS
		{
			from_status: UserRegisterStatus2.FILLED,
			to_status: UserRegisterStatus2.CREATED,
		},
		{
			from_status: UserRegisterStatus2.FILLED,
			to_status: UserRegisterStatus2.FILLED,
		},
		{
			from_status: UserRegisterStatus2.FILLED,
			to_status: UserRegisterStatus2.FINISHED,
		},
		// Complete
		{
			from_status: UserRegisterStatus2.FINISHED,
			to_status: UserRegisterStatus2.CREATED,
		},
		{
			from_status: UserRegisterStatus2.FINISHED,
			to_status: UserRegisterStatus2.FILLED,
		},
		{
			from_status: UserRegisterStatus2.FINISHED,
			to_status: UserRegisterStatus2.FINISHED,
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
		fromStatus?: UserRegisterStatus2,
		toStatus?: UserRegisterStatus2,
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
		formDTStatus: UserRegisterStatus2,
		toDTStatus: UserRegisterStatus2,
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
