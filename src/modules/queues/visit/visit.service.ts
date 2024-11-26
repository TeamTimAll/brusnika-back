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
import { IVisit, IVisitFreeTime } from "./types";

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

	async timeSlots(slots: IVisitFreeTime) {
		const data: Pick<BaseDto<IVisitFreeTime>, "data"> = {
			data: slots,
		};

		return await this.queueService.send(data);
	}

	async getTimeSlots(project_id: number): Promise<IVisitFreeTime> {
		let project: ProjectEntity | undefined;
		if (project_id) {
			project = await this.projectService.readOne(
				project_id,
				{
					ext_id: true,
					buildings: { premises: { type: true } },
				},
				{ buildings: { premises: true } },
			);
		}

		return {
			method: "POST",
			url: "https://1c.tarabanov.tech/crm/hs/ofo/FreeTime",
			data: {
				requestType: "schedule",
				type: "offline",
				project: "58dab450-25e4-11e9-b797-4fe75fbf4950",
				premisesKind:
					project?.buildings?.[0]?.premises?.[0]?.type ?? null,
			},
		};
	}

	async createFormEntity(visit: VisitsEntity): Promise<IVisit> {
		let agent: UserEntity | undefined;
		if (visit.agent_id) {
			agent = await this.userService.readOne(visit.agent_id);
		}

		let client: ClientEntity | undefined;
		if (visit.client_id) {
			client = await this.clientService.readOne(visit.client_id);
		}

		let project: ProjectEntity | undefined;
		if (visit.project_id) {
			project = await this.projectService.readOne(
				visit.project_id,
				{
					ext_id: true,
					name: true,
					buildings: { premises: { type: true } },
				},
				{ buildings: { premises: true } },
			);
		}

		return {
			method: "POST",
			url: "https://1c.tarabanov.tech/crm/hs/ofo/FreeTime",
			data: {
				requestType: "create_demo",
				type: "offline",
				date: `${new Date(visit.date).toISOString().split("T")[0]}T${visit.time}`,
				name: client?.fullname,
				phone: client?.phone_number,
				project: project?.ext_id,
				premisesKind:
					project?.buildings?.[0]?.premises?.[0]?.type ?? null,
				realtor: {
					name: `${agent?.firstName} ${agent?.lastName}`,
					phone: agent?.phone,
					agency: agent?.agency.title,
				},
			},
		};
	}
}
