export enum LogColor {
	NONE = "",
	RESET = "\x1b[0m",
	BRIGHT = "\x1b[1m",
	DIM = "\x1b[2m",
	UNDERSCORE = "\x1b[4m",
	BLINK = "\x1b[5m",
	REVERSE = "\x1b[7m",
	HIDDEN = "\x1b[8m",

	BLACK_TEXT = "\x1b[30m",
	RED_TEXT = "\x1b[31m",
	GREEN_TEXT = "\x1b[32m",
	YELLOW_TEXT = "\x1b[33m",
	BLUE_TEXT = "\x1b[34m",
	MAGENTA_TEXT = "\x1b[35m",
	CYAN_TEXT = "\x1b[36m",
	WHITE_TEXT = "\x1b[37m",
	GRAY_TEXT = "\x1b[90m",

	BLACK_TEXT_BACKGOUND = "\x1b[40m",
	RED_TEXT_BACKGOUND = "\x1b[41m",
	GREEN_TEXT_BACKGOUND = "\x1b[42m",
	YELLOW_TEXT_BACKGOUND = "\x1b[43m",
	BLUE_TEXT_BACKGOUND = "\x1b[44m",
	MAGENTA_TEXT_BACKGOUND = "\x1b[45m",
	CYAN_TEXT_BACKGOUND = "\x1b[46m",
	WHITE_TEXT_BACKGOUND = "\x1b[47m",
	GRAY_TEXT_BACKGOUND = "\x1b[100m",
}

export function logColorize(color: LogColor, text: string) {
	return color + text + LogColor.RESET;
}
