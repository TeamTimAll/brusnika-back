import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsSelect, In, Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";
import { PickBySelect } from "interfaces/pick_by_select";

import { ClientService } from "../client/client.service";
import { ProjectService } from "../projects/projects.service";
import { VisitQueueService } from "../queues/visit/visit.service";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import { NotificationType } from "../notification/notification.entity";
import { NotificationService } from "../notification/notification.service";

import { CreateVisitsDto } from "./dtos/CreateVisits.dto";
import { UpdateVisitsDto } from "./dtos/UpdateVisits.dto";
import { VisitNotFoundError } from "./errors/VisitsNotFound.error";
import { VisitsEntity, VisitStatus } from "./visits.entity";
import { TimeSlotDto } from "./dtos/time-slot.dto";

@Injectable()
export class VisitsService {
	constructor(
		@InjectRepository(VisitsEntity)
		private visitsRepository: Repository<VisitsEntity>,
		@Inject() private projectService: ProjectService,
		@Inject() private clientService: ClientService,
		@Inject() private userService: UserService,
		@Inject(forwardRef(() => VisitQueueService))
		private readonly visitQueueService: VisitQueueService,
		private readonly notificationService: NotificationService,
	) {}

	get repository(): Repository<VisitsEntity> {
		return this.visitsRepository;
	}

	async create(dto: CreateVisitsDto) {
		if (typeof dto.project_id !== "undefined") {
			await this.projectService.checkExists(dto.project_id);
		}
		if (typeof dto.client_id !== "undefined") {
			await this.clientService.checkExists(dto.client_id);
		}
		if (typeof dto.agent_id !== "undefined") {
			await this.userService.checkExists(dto.agent_id);
		}

		dto.date = dto.date.replace(/[+-]\d{2}:\d{2}$/, "Z");

		const visit = this.visitsRepository.create(dto);

		await this.visitQueueService.makeRequest(
			await this.visitQueueService.createFormEntity(visit),
		);

		const userTokens = (await this.userService.repository.find({
			select: { id: true, firebase_token: true },
			where: {
				id: In([visit.agent_id]),
			},
		})) as Array<Pick<UserEntity, "id" | "firebase_token">>;

		const formattedDate = `${visit.date.getDay()}.${visit.date.getMonth() + 1}.${visit.date.getFullYear()}`;

		await this.notificationService.sendToUsers(userTokens, {
			title: "Запись на показ",
			description: `Клиент ${visit.client.fullname} записался на показ по проекту ${visit.project.name} на ${formattedDate}`,
			type: NotificationType.VISIT_ASSIGNED,
			object_id: visit.id,
		});

		return await this.visitsRepository.save(visit);
	}

	async readAll(user: ICurrentUser): Promise<VisitsEntity[]> {
		return this.visitsRepository.find({
			where: { agent_id: user.user_id },
		});
	}

	async getTimeSlots(query: TimeSlotDto) {
		// if (query.debug) {
		// 	return [
		// 		{
		// 			"2024-11-30": [
		// 				{
		// 					start: "10:00",
		// 					end: "11:30",
		// 				},
		// 				{
		// 					start: "11:30",
		// 					end: "13:00",
		// 				},
		// 				{
		// 					start: "13:00",
		// 					end: "14:30",
		// 				},
		// 				{
		// 					start: "14:30",
		// 					end: "16:00",
		// 				},
		// 				{
		// 					start: "16:00",
		// 					end: "17:30",
		// 				},
		// 				{
		// 					start: "17:30",
		// 					end: "19:00",
		// 				},
		// 			],
		// 		},
		// 		{
		// 			"2024-12-01": [
		// 				{
		// 					start: "10:00",
		// 					end: "11:30",
		// 				},
		// 				{
		// 					start: "11:30",
		// 					end: "13:00",
		// 				},
		// 				{
		// 					start: "13:00",
		// 					end: "14:30",
		// 				},
		// 				{
		// 					start: "14:30",
		// 					end: "16:00",
		// 				},
		// 				{
		// 					start: "16:00",
		// 					end: "17:30",
		// 				},
		// 				{
		// 					start: "17:30",
		// 					end: "19:00",
		// 				},
		// 			],
		// 		},
		// 		{
		// 			"2024-12-02": [
		// 				{
		// 					start: "10:00",
		// 					end: "11:30",
		// 				},
		// 				{
		// 					start: "11:30",
		// 					end: "13:00",
		// 				},
		// 				{
		// 					start: "13:00",
		// 					end: "14:30",
		// 				},
		// 				{
		// 					start: "14:30",
		// 					end: "16:00",
		// 				},
		// 				{
		// 					start: "16:00",
		// 					end: "17:30",
		// 				},
		// 				{
		// 					start: "17:30",
		// 					end: "19:00",
		// 				},
		// 			],
		// 		},
		// 		{
		// 			"2024-12-03": [
		// 				{
		// 					start: "10:00",
		// 					end: "11:30",
		// 				},
		// 				{
		// 					start: "11:30",
		// 					end: "13:00",
		// 				},
		// 				{
		// 					start: "13:00",
		// 					end: "14:30",
		// 				},
		// 				{
		// 					start: "14:30",
		// 					end: "16:00",
		// 				},
		// 				{
		// 					start: "16:00",
		// 					end: "17:30",
		// 				},
		// 				{
		// 					start: "17:30",
		// 					end: "19:00",
		// 				},
		// 			],
		// 		},
		// 		{
		// 			"2024-12-04": [
		// 				{
		// 					start: "10:00",
		// 					end: "11:30",
		// 				},
		// 				{
		// 					start: "11:30",
		// 					end: "13:00",
		// 				},
		// 				{
		// 					start: "13:00",
		// 					end: "14:30",
		// 				},
		// 				{
		// 					start: "14:30",
		// 					end: "16:00",
		// 				},
		// 				{
		// 					start: "16:00",
		// 					end: "17:30",
		// 				},
		// 				{
		// 					start: "17:30",
		// 					end: "19:00",
		// 				},
		// 			],
		// 		},
		// 		{
		// 			"2024-12-05": [
		// 				{
		// 					start: "10:00",
		// 					end: "11:30",
		// 				},
		// 				{
		// 					start: "11:30",
		// 					end: "13:00",
		// 				},
		// 				{
		// 					start: "13:00",
		// 					end: "14:30",
		// 				},
		// 				{
		// 					start: "14:30",
		// 					end: "16:00",
		// 				},
		// 				{
		// 					start: "16:00",
		// 					end: "17:30",
		// 				},
		// 				{
		// 					start: "17:30",
		// 					end: "19:00",
		// 				},
		// 			],
		// 		},
		// 		{
		// 			"2024-12-06": [
		// 				{
		// 					start: "10:00",
		// 					end: "11:30",
		// 				},
		// 				{
		// 					start: "11:30",
		// 					end: "13:00",
		// 				},
		// 				{
		// 					start: "13:00",
		// 					end: "14:30",
		// 				},
		// 				{
		// 					start: "14:30",
		// 					end: "16:00",
		// 				},
		// 				{
		// 					start: "16:00",
		// 					end: "17:30",
		// 				},
		// 				{
		// 					start: "17:30",
		// 					end: "19:00",
		// 				},
		// 			],
		// 		},
		// 	];
		// }

		const response = await this.visitQueueService.timeSlots(
			await this.visitQueueService.getTimeSlots(query.project_id),
		);

		if (response) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return response.data;
		}
	}

	async readOne(id: number): Promise<VisitsEntity> {
		const findOne = await this.visitsRepository.findOne({
			where: { id },
		});
		if (!findOne) {
			throw new VisitNotFoundError(`'${id}' city not found`);
		}
		return findOne;
	}

	async readOneByExtId<T extends FindOptionsSelect<VisitsEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<VisitsEntity, T>> {
		const booking = await this.visitsRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!booking) {
			throw new VisitNotFoundError(`ext_id: ${ext_id}`);
		}
		return booking;
	}

	async readOneByExtWithoutErrorId<T extends FindOptionsSelect<VisitsEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<VisitsEntity, T> | null> {
		const booking = await this.visitsRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});

		return booking;
	}

	async update(
		id: number,
		dto: Partial<UpdateVisitsDto>,
	): Promise<VisitsEntity> {
		let foundVisit = await this.readOne(id);
		if (typeof dto.project_id !== "undefined") {
			await this.projectService.checkExists(dto.project_id);
		}
		if (typeof dto.client_id !== "undefined") {
			await this.clientService.checkExists(dto.client_id);
		}
		if (typeof dto.agent_id !== "undefined") {
			await this.userService.checkExists(dto.agent_id);
		}

		const mergedCity = this.visitsRepository.merge(foundVisit, dto);
		foundVisit = await this.visitsRepository.save(mergedCity);

		if (foundVisit.status === VisitStatus.FAIL) {
			const userTokens = (await this.userService.repository.find({
				select: { id: true, firebase_token: true },
				where: {
					id: In([foundVisit.agent_id]),
				},
			})) as Array<Pick<UserEntity, "id" | "firebase_token">>;

			const formattedDate = `${foundVisit.date.getDay()}.${foundVisit.date.getMonth() + 1}.${foundVisit.date.getFullYear()}`;

			await this.notificationService.sendToUsers(userTokens, {
				title: "Отмена записи на показ",
				description: `Запись ${foundVisit.client.fullname} по проекту ${foundVisit.project.name} на ${formattedDate} отменен`,
				type: NotificationType.TASK_STATE_CHANGE,
				object_id: foundVisit.id,
			});
		}

		return foundVisit;
	}

	async delete(id: number): Promise<VisitsEntity> {
		const foundVisit = await this.readOne(id);
		await this.visitsRepository.delete(id);
		return foundVisit;
	}
}
