import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { BuildingQueuervice } from "./building.service";
import { BuildingDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/building")
export class BuildingQueueController {
	constructor(private readonly service: BuildingQueuervice) {}

	@Post()
	async execute(@Body() payload: IEncryptedText) {
		const building = JSON.parse(decrypt(payload)) as BuildingDto;

		await this.service.createOrUpdateBuilding(building);
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.projectService.remove(+id);
	// }
}
