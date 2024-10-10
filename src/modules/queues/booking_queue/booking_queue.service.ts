import { Injectable } from "@nestjs/common";

import { UserEntity } from "modules/user/user.entity";

import { BaseDto } from "../../../common/base/base_dto";
import { BookingsEntity } from "../../bookings/bookings.entity";
import { ClientEntity } from "../../client/client.entity";
import { ClientService } from "../../client/client.service";
import { PremiseEntity } from "../../premises/premises.entity";
import { PremisesService } from "../../premises/premises.service";
import { UserService } from "../../user/user.service";
import { QueueService } from "../queue.service";

import { BookingQueueDto } from "./dto/BookingQueue.dto";
import { BookingStatusChangeDto } from "./dto/BookingStatusChange.dto";

@Injectable()
export class BookingQueueService {
	constructor(
		private readonly queueService: QueueService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly premisesService: PremisesService,
	) {}

	makeRequest(booking: BookingQueueDto) {
		const data: Pick<BaseDto<BookingQueueDto>, "data"> = {
			data: booking,
		};
		this.queueService.send("request_booking", data);
	}

	requestStatusChange(dto: BookingStatusChangeDto) {
		const data: Pick<BaseDto<BookingStatusChangeDto>, "data"> = {
			data: dto,
		};
		this.queueService.send("request_booking_status_change", data);
	}

	async createFormEntity(booking: BookingsEntity): Promise<BookingQueueDto> {
		let agent: UserEntity | undefined;
		if (booking.agent_id) {
			agent = await this.userService.readOne(booking.agent_id, {
				ext_id: true,
			});
		}

		let client: ClientEntity | undefined;
		if (booking.client_id) {
			client = await this.clientService.readOne(booking.client_id, {
				ext_id: true,
			});
		}

		let premise: PremiseEntity | undefined;
		if (booking.premise_id) {
			premise = await this.premisesService.readOne(booking.premise_id, {
				ext_id: true,
			});
		}

		return {
			ext_id: booking.ext_id,
			// date: booking.date,
			// time: booking.time,
			purchase_option: booking.purchase_option,
			status: booking.status,
			agent_ext_id: agent?.ext_id ?? null,
			client_ext_id: client?.ext_id ?? null,
			premise_ext_id: premise?.ext_id ?? null,
		};
	}
}
