import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { PremiseQueueService } from "./premise.service";
import { PremiseDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/premise")
export class PremiseQueueController {
	constructor(private readonly service: PremiseQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const premise = JSON.parse(decrypt(data)) as PremiseDto;

		await this.service.createOrUpdatePremise(premise);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
