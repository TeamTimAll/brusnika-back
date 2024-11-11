import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { ClientService } from "../../client/client.service";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";
import { ClientEntity } from "../../client/client.entity";
import { BaseDto } from "../../../common/base/base_dto";
import { QueueService } from "../queue.service";

import { ClientDto } from "./dto";

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

	async send(client: ClientDto) {
		const data: Pick<BaseDto<ClientDto>, "data"> = {
			data: client,
		};

		await this.queueService.send("url", data);
	}

	async createFromEntity(client: ClientEntity): Promise<ClientDto> {
		const agent = await this.userService.readOne(client.agent_id, {
			ext_id: true,
		});
		return {
			ext_id: client.ext_id ?? null,
			actived_date: client.actived_date?.toISOString() ?? null,
			fullname: client.fullname,
			phone_number: client.phone_number,
			expiration_date: client.expiration_date,
			confirmation_type: client.confirmation_type,
			agent_ext_id: agent.ext_id,
			comment: client.comment,
			fixing_type: client.fixing_type,
			node: client.node,
		};
	}
}
