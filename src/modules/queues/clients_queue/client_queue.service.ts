import { Injectable } from "@nestjs/common";

import { BaseDto } from "../../../common/base/base_dto";
import { ClientEntity } from "../../client/client.entity";
import { UserService } from "../../user/user.service";
import { ClientQueueDto } from "../events_queue/dto/ClientQueue.dto";
import { QueueService } from "../queue.service";

@Injectable()
export class ClinetQueueService {
	constructor(
		private readonly queueService: QueueService,
		private readonly userService: UserService,
	) {}

	send(client: ClientQueueDto) {
		const data: Pick<BaseDto<ClientQueueDto>, "data"> = {
			data: client,
		};
		this.queueService.send("clients", data);
	}

	async createFromEntity(client: ClientEntity): Promise<ClientQueueDto> {
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
