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

import { ClientDto } from "./dto";
import { IClient } from "./types/client.type";

@Injectable()
export class ClientQueueService {
	constructor(
		private readonly userService: UserService,
		@Inject(forwardRef(() => ClientService))
		private readonly clientService: ClientService,
		private readonly queueService: QueueService,
	) {}

	async createOrUpdateClient(client: ClientDto) {
		let agent: Pick<UserEntity, "id"> | undefined;
		if (client.agent_ext_id) {
			agent = await this.userService.readOneByExtId(client.agent_ext_id, {
				id: true,
			});
		}
		return this.clientService.repository
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
			.orUpdate(
				[
					"fullname",
					"phone_number",
					"email",
					"actived_date",
					"comment",
					"confirmation_type",
					"fixing_type",
					"expiration_date",
					"node",
					"agent_id",
				],
				["ext_id"],
			)
			.execute();
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
				realtor: {
					phone: agent.phone,
					name: agent.fullName,
				},
				agency: {
					name: agent.agency.title,
				},
				client: {
					phone: client.phone_number,
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
