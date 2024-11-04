import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { SectionQueueService } from "./section.service";
import { SectionDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/section")
export class SectionQueueController {
	constructor(private readonly service: SectionQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const section = JSON.parse(decrypt(data)) as SectionDto;

		await this.service.createOrUpdateSection(section);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
