import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { VisitQueueService } from "./visit.service";
import { VisitQueueDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/visit")
export class VisitQueueController {
	constructor(private readonly service: VisitQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const visit = JSON.parse(decrypt(data)) as VisitQueueDto;

		await this.service.createOrUpdateVisit(visit);

		return { message: "SUCCESS" };
	}
}
