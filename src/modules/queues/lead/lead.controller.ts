import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { LeadQueueService } from "./lead.service";
import { LeadDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/lead")
export class LeadQueueController {
	constructor(private readonly service: LeadQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const client = JSON.parse(decrypt(data)) as LeadDto;

		await this.service.createOrUpdateLead(client);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
