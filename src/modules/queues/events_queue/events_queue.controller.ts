import { Controller } from "@nestjs/common";
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from "@nestjs/microservices";
import { Channel, Message } from "amqplib";

import { IEncryptedText, decrypt } from "../../../lib/crypto";

import { EventsQueueMessageMetaDataDto } from "./dto/events.dto";
import { EventsQueueService } from "./events_queue.service";

@Controller()
export class EventsQueueController {
	constructor(private readonly eventsService: EventsQueueService) {}

	@MessagePattern("events")
	public async execute(
		@Payload() data: IEncryptedText,
		@Ctx() context: RmqContext,
	) {
		const channel = context.getChannelRef() as Channel;
		const orginalMessage = context.getMessage() as Message;
		const event = JSON.parse(
			decrypt(data),
		) as EventsQueueMessageMetaDataDto;

		await this.eventsService.getAll(event.data);

		channel.ack(orginalMessage);
	}
}
