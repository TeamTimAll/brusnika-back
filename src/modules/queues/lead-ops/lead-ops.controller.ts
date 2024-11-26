import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { LeadOpsQueueService } from "./lead-ops.service";
import { LeadOpsDto, LeadOpsesDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/lead-ops")
export class LeadOpsQueueController {
	constructor(private readonly service: LeadOpsQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const leadOps = JSON.parse(decrypt(data)) as LeadOpsDto;

		await this.service.createOrUpdateLeadOps(leadOps);

		return { message: "SUCCESS" };
	}

	@Post("many")
	async executeMany(@Body() data: IEncryptedText) {
		const leads = JSON.parse(decrypt(data)) as LeadOpsesDto;

		await this.service.createLeadOpses(leads);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
