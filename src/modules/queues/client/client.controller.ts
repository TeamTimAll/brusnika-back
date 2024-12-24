import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { ClientQueueService } from "./client.service";
import { ClientDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/client")
export class ClientQueueController {
	constructor(private readonly service: ClientQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const client = JSON.parse(decrypt(data)) as ClientDto;

		console.log(client)

		await this.service.createOrUpdateClient(client);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
