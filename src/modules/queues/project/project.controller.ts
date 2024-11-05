import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { decrypt, IEncryptedText } from "../../../lib/crypto";

import { ProjectQueueService } from "./project.service";
import { ProjectDto } from "./dto";

@ApiTags("QUEUE")
@Controller("queue/project")
export class ProjectController {
	constructor(private readonly projectService: ProjectQueueService) {}

	@Post()
	async execute(@Body() data: IEncryptedText) {
		const project = JSON.parse(decrypt(data)) as ProjectDto;

		await this.projectService.createOrUpdateProject(project);

		return { message: "SUCCESS" };
	}

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	console.log(id);

	// return this.projectService.remove(+id);
	// }
}
