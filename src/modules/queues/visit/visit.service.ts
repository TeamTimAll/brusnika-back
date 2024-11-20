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

import { VisitStatusChangeDto } from "./dto/VisitStatusChange.dto";
import { IVisit } from "./types";

@Injectable()
export class VisitQueueService {
	constructor(
		private readonly queueService: QueueService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly projectService: ProjectService,
	) {}

	async makeRequest(visit: IVisit) {
		const data: Pick<BaseDto<IVisit>, "data"> = {
			data: visit,
		};
		await this.queueService.send(data);
	}

	async requestStatusChange(dto: VisitStatusChangeDto) {
		const data: Pick<BaseDto<VisitStatusChangeDto>, "data"> = {
			data: dto,
		};

		await this.queueService.send(data);
	}

	async timeSlots(dto: VisitStatusChangeDto) {
		const data: Pick<BaseDto<VisitStatusChangeDto>, "data"> = {
			data: dto,
		};

		return await this.queueService.send(data);
	}

	async createFormEntity(visit: VisitsEntity): Promise<IVisit> {
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
			method: "POST",
			url: "https://1c.tarabanov.tech/crm/hs/ofo/FreeTime",
			data: {
				requestType: "create_demo",
				type: "offline",
				date: visit.date,
				name: client?.fullname,
				phone: client?.phone_number,
				project: project?.name,
				premisesKind:
					project?.buildings?.[0]?.premises?.[0]?.type ?? null,
				realtor: {
					name: agent?.fullName,
					phone: agent?.phone,
					agency: agent?.agency.title,
				},
			},
		};
	}
}
