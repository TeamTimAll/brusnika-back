import { NotFoundException } from "@nestjs/common";

export class EventsNotFoundException extends NotFoundException {
	constructor(error?: string) {
		super("error.EventsNotFound", error);
	}
}
