export function getNextDate(): Date {
	const today = new Date();
	today.setDate(today.getDate() + 1);
	return today;
}

export function getDaysDiff(fromDate: Date, toDate: Date): number {
	const diffInTime = fromDate.getTime() - toDate.getTime();
	return Math.floor(diffInTime / (1000 * 3600 * 24));
}
