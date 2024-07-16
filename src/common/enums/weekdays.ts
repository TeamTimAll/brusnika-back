export enum Weekdays {
	Sunday = 0,
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6,
}

export enum RussianWeekdaysString {
	Sunday = "воскресенье",
	Monday = "понедельник",
	Tuesday = "вторник",
	Wednesday = "среда",
	Thursday = "четверг",
	Friday = "пятница",
	Saturday = "суббота",
}

export const WeekdaysMap = new Map<RussianWeekdaysString, Weekdays>([
	[RussianWeekdaysString.Sunday, Weekdays.Sunday],
	[RussianWeekdaysString.Monday, Weekdays.Monday],
	[RussianWeekdaysString.Tuesday, Weekdays.Tuesday],
	[RussianWeekdaysString.Wednesday, Weekdays.Wednesday],
	[RussianWeekdaysString.Thursday, Weekdays.Thursday],
	[RussianWeekdaysString.Friday, Weekdays.Friday],
	[RussianWeekdaysString.Saturday, Weekdays.Saturday],
]);
