export function getNextDate(): Date {
	const today = new Date();
	today.setDate(today.getDate() + 1);
	return today;
}

export function getDaysDiff(fromDate: Date, toDate: Date): number {
	const diffInTime = fromDate.getTime() - toDate.getTime();
	return Math.floor(diffInTime / (1000 * 3600 * 24));
}

type TimeComponent = "HH" | "MM" | "SS";
type TimeFormat =
	| `${TimeComponent}:${TimeComponent}:${TimeComponent}`
	| `${TimeComponent}:${TimeComponent}`;

export function formatTime(timeString: string, format: TimeFormat) {
	const [hours = "00", minutes = "00", seconds = "00"] =
		timeString.split(":");

	const formattedTime = format
		.replace("HH", hours)
		.replace("MM", minutes)
		.replace("SS", seconds);

	return formattedTime;
}
