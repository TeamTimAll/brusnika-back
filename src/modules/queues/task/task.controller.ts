import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { TaskQueueService } from "./task.service";
import { TaskDto, TasksDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/task")
export class TaskQueueController {
	constructor(private readonly service: TaskQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const task = JSON.parse(decrypt(data)) as TaskDto;

		await this.service.createOrUpdateTask(task);

		return { message: "SUCCESS" };
	}

	@Post("many")
	async executeMany(@Body() data: IEncryptedText) {
		const tasks = JSON.parse(decrypt(data)) as TasksDto;

		await this.service.createTasks(tasks);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.service.remove(+id);
	// }
}
