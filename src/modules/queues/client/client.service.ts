import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { ClientService } from "../../client/client.service";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";
import {
	ClientEntity,
	ConfirmationType,
	ConfirmationTypeKontur,
} from "../../client/client.entity";
import { BaseDto } from "../../../common/base/base_dto";
import { QueueService } from "../queue.service";
import { NotificationService } from "../../notification/notification.service";
import { NotificationType } from "../../notification/notification.entity";

import { ClientDto } from "./dto";
import { IClient } from "./types/client.type";

@Injectable()
export class ClientQueueService {
	constructor(
		private readonly userService: UserService,
		@Inject(forwardRef(() => ClientService))
		private readonly clientService: ClientService,
		private readonly queueService: QueueService,
		private readonly notificationService: NotificationService,
	) {}

	async createOrUpdateClient(client: ClientDto) {
		let agent: Pick<UserEntity, "id" | "firebase_token"> | undefined;
		try {
			if (client.agent_ext_id) {
				agent = await this.userService.readOneByExtId(client.agent_ext_id, {
					id: true,
					firebase_token: true,
				});
			}
	
			const foundClient = await this.clientService.repository.findOne({
				where: {
					phone_number: client.phone_number,
					// fullname: client.fullname,
				},
			});
	
			if (foundClient) {
				if (agent && agent.firebase_token) {
					await this.notificationService.sendToUsers([agent], {
						type: NotificationType.UPDATE_CLIENT,
						description: `У клиента ${foundClient.fullname} изменился статус закрепления`,
						title: "Закрепления",
					});
				}
	
				return await this.clientService.repository
					.createQueryBuilder()
					.update()
					.set({
						ext_id: client.ext_id,
						fullname: client.fullname,
						phone_number: client.phone_number,
						email: client.email,
						actived_date: client.actived_date,
						comment: client.comment,
						confirmation_type: client.confirmation_type,
						fixing_type: client.fixing_type,
						expiration_date: client.expiration_date,
						node: client.node,
						agent_id: agent?.id,
					})
					.where("id = :id", { id: foundClient.id })
					.execute();
			} else {
				return await this.clientService.repository
					.createQueryBuilder()
					.insert()
					.values({
						ext_id: client.ext_id,
						fullname: client.fullname,
						phone_number: client.phone_number,
						email: client.email,
						actived_date: client.actived_date,
						comment: client.comment,
						confirmation_type: client.confirmation_type,
						fixing_type: client.fixing_type,
						expiration_date: client.expiration_date,
						node: client.node,
						agent_id: agent?.id,
						fixing_type_updated_at: new Date(),
					})
					.execute();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async send(client: IClient) {
		const data: Pick<BaseDto<IClient>, "data"> = {
			data: client,
		};

		await this.queueService.send(data);
	}

	async createFromEntity(client: ClientEntity): Promise<IClient> {
		const agent = await this.userService.readOne(client.agent_id, {
			ext_id: true,
			agency: { title: true },
			phone: true,
			fullName: true,
		});

		return {
			url: "https://1c.tarabanov.tech/crm/hs/ofo",
			method: "POST",
			data: {
				requestType: "realtorForm",
				contourId: "0100afa8-b6c2-11ea-8f75-34e12d85ce6a",
				contactType: {
					isClient: true,
				},
				realtor: {
					agentId: agent.id,
					phone: `+${agent.phone}`,
					name: agent.fullName,
				},
				agency: {
					name: agent.agency.title,
				},
				client: {
					phone: `+${client.phone_number}`,
					name: client.fullname,
				},
				contact:
					client.confirmation_type === ConfirmationType.PHONE
						? ConfirmationTypeKontur.PHONE
						: ConfirmationTypeKontur.SMS,
			},
		};
	}
}
