import { Injectable } from "@nestjs/common";

import { UserEntity } from "modules/user/user.entity";

import { BaseDto } from "../../../common/base/base_dto";
import { ClientEntity } from "../../client/client.entity";
import { ClientService } from "../../client/client.service";
import { ProjectEntity } from "../../projects/project.entity";
import { ProjectService } from "../../projects/projects.service";
import { UserService } from "../../user/user.service";
import { VisitsEntity } from "../../visits/visits.entity";
import { QueueService } from "../queue.service";

import { VisitQueueDto } from "./dto/VisitQueue.dto";
import { VisitStatusChangeDto } from "./dto/VisitStatusChange.dto";

@Injectable()
export class VisitQueueService {
	constructor(
		private readonly queueService: QueueService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly projectService: ProjectService,
	) {}

	makeRequest(visit: VisitQueueDto) {
		const data: Pick<BaseDto<VisitQueueDto>, "data"> = {
			data: visit,
		};
		this.queueService.send("request_visit", data);
	}

	requestStatusChange(dto: VisitStatusChangeDto) {
		const data: Pick<BaseDto<VisitStatusChangeDto>, "data"> = {
			data: dto,
		};
		this.queueService.send("request_visit_status_change", data);
	}

	async createFormEntity(visit: VisitsEntity): Promise<VisitQueueDto> {
		let agent: UserEntity | undefined;
		if (visit.agent_id) {
			agent = await this.userService.readOne(visit.agent_id, {
				ext_id: true,
			});
		}

		let client: ClientEntity | undefined;
		if (visit.client_id) {
			client = await this.clientService.readOne(visit.client_id, {
				ext_id: true,
			});
		}

		let project: ProjectEntity | undefined;
		if (visit.project_id) {
			project = await this.projectService.readOne(visit.project_id, {
				ext_id: true,
			});
		}

		return {
			ext_id: visit.ext_id,
			date: visit.date,
			time: visit.time,
			request_date: visit.request_date,
			request_time: visit.request_time,
			note: visit.note,
			status: visit.status,
			agent_ext_id: agent?.ext_id ?? null,
			client_ext_id: client?.ext_id ?? null,
			project_ext_id: project?.ext_id ?? null,
		};
	}
}
