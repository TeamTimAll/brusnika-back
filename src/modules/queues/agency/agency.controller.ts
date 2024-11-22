import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { AgencyQueueService } from "./agency.service";
import { AgencyDto, AgenciesDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/agency")
export class AgencyQueueController {
	constructor(private readonly service: AgencyQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const agency = JSON.parse(decrypt(data)) as AgencyDto;

		await this.service.createOrUpdateAgency(agency);

		return { message: "SUCCESS" };
	}

	@Post("many")
	async executeMany(@Body() data: IEncryptedText) {
		const agencies = JSON.parse(decrypt(data)) as AgenciesDto;

		await this.service.createAgencies(agencies);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
