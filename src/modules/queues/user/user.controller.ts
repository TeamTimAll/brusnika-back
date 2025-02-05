import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { UserQueueService } from "./user.service";
import { UserDto, UsersDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/user")
export class UserQueueController {
	constructor(private readonly service: UserQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const client = JSON.parse(decrypt(data)) as UserDto;

		await this.service.createOrUpdateUser(client);

		return { message: "SUCCESS" };
	}

	@Post("many")
	async executeMany(@Body() data: IEncryptedText) {
		const users = JSON.parse(decrypt(data)) as UsersDto;

		await this.service.createUsers(users);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
