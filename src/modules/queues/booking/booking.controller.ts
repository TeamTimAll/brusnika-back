import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { BookingQueueService } from "./booking.service";
import { BookingDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/booking")
export class BookingQueueController {
	constructor(private readonly service: BookingQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const booking = JSON.parse(decrypt(data)) as BookingDto;

		await this.service.createOrUpdateBooking(booking);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
