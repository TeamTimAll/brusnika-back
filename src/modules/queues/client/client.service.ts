import { Injectable } from "@nestjs/common";

import { ClientService } from "../../client/client.service";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";

import { ClientDto } from "./dto";

@Injectable()
export class ClientQueueService {
	constructor(
		private readonly userService: UserService,
		private readonly clientService: ClientService,
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
}
