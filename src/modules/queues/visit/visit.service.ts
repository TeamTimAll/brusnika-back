import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { UserEntity } from "modules/user/user.entity";

import { BaseDto } from "../../../common/base/base_dto";
import { ClientEntity } from "../../client/client.entity";
import { ClientService } from "../../client/client.service";
import { ProjectEntity } from "../../projects/project.entity";
import { ProjectService } from "../../projects/projects.service";
import { UserService } from "../../user/user.service";
import { VisitsEntity } from "../../visits/visits.entity";
import { QueueService } from "../queue.service";
import { VisitsService } from "../../visits/visits.service";

import { VisitStatusChangeDto } from "./dto/VisitStatusChange.dto";
import { IVisit, IVisitFreeTime } from "./types";
import { VisitQueueDto } from "./dto/VisitQueue.dto";

@Injectable()
export class VisitQueueService {
	constructor(
		private readonly queueService: QueueService,
		@Inject(forwardRef(() => VisitsService))
		private readonly visitService: VisitsService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly projectService: ProjectService,
	) {}

	async createOrUpdateVisit(visit: VisitQueueDto) {
		let project: Pick<ProjectEntity, "id"> | undefined;

		if (visit.project_ext_id) {
			project = await this.projectService.readOneByExtId(
				visit.project_ext_id,
				{ id: true },
			);
		}

		let agent: Pick<UserEntity, "id"> | undefined;
		if (visit.agent_ext_id) {
			agent = await this.userService.readOneByExtId(visit.agent_ext_id, {
				id: true,
			});
		}

		let client: Pick<ClientEntity, "id"> | undefined;
		if (visit.client_ext_id) {
			client = await this.userService.readOneByExtId(
				visit.client_ext_id,
				{
					id: true,
				},
			);
		}

		return this.visitService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: visit.ext_id,
				project_id: project?.id,
				agent_id: agent?.id,
				client_id: client?.id,
				request_date: visit.request_date,
				request_time: visit.request_time,
				note: visit.note,
				date: visit.date,
				time: visit.time,
				status: visit.status,
			})
			.orUpdate(
				[
					"project_id",
					"agent_id",
					"client_id",
					"request_date",
					"request_time",
					"note",
					"date",
					"time",
					"status",
				],
				["ext_id"],
			)
			.execute();
	}

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
				phone: `+${client?.phone_number}`,
				project: project?.ext_id,
				premisesKind:
					project?.buildings?.[0]?.premises?.[0]?.type ?? null,
				realtor: {
					name: `${agent?.firstName} ${agent?.lastName}`,
					phone: agent?.phone,
					agency: agent?.agency?.title,
				},
			},
		};
	}
}
