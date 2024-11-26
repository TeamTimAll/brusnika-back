import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { BookingsService } from "../../bookings/bookings.service";
import { ClientService } from "../../client/client.service";
import { BaseDto } from "../../../common/base/base_dto";
import { QueueService } from "../queue.service";
import { BookingsEntity } from "../../bookings/bookings.entity";
import { ClientEntity } from "../../client/client.entity";
import { PremiseEntity } from "../../premises/premises.entity";
import { PremisesService } from "../../premises/premises.service";
import { UserEntity } from "../../user/user.entity";
import { UserService } from "../../user/user.service";
import { LeadsService } from "../../leads/leads.service";
import { LeadsEntity } from "../../leads/leads.entity";

import { BookingDto } from "./dto";
import { IBooking } from "./types/booking.type";

@Injectable()
export class BookingQueueService {
	constructor(
		@Inject(forwardRef(() => BookingsService))
		private readonly bookingService: BookingsService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly premisesService: PremisesService,
		private readonly queueService: QueueService,
		private readonly leadsService: LeadsService,
	) {}

	async createOrUpdateBooking(booking: BookingDto) {
		const foundBooking = await this.bookingService.readOneByExtId(
			booking.booking_ext_id,
			{ id: true, agent: { id: true } },
		);

		return this.bookingService.update(foundBooking.id, {
			status: booking.status,
		});
	}

	async makeRequest(booking: IBooking) {
		const data: Pick<BaseDto<IBooking>, "data"> = {
			data: booking,
		};
		await this.queueService.send(data);
	}

	async requestStatusChange(dto: BookingDto) {
		const data: Pick<BaseDto<BookingDto>, "data"> = {
			data: dto,
		};

		await this.queueService.send(data);
	}

	async createFormEntity(booking: BookingsEntity): Promise<IBooking> {
		let agent: UserEntity | undefined;
		if (booking.agent_id) {
			agent = await this.userService.readOne(booking.agent_id, {
				ext_id: true,
			});
		}

		let client: ClientEntity | undefined;
		let lead: LeadsEntity | undefined;

		if (booking.client_id) {
			client = await this.clientService.readOne(booking.client_id, {
				ext_id: true,
			});

			lead = await this.leadsService.readOneByClientId(
				booking.client_id,
				{ ext_id: true },
			);
		}

		let premise: PremiseEntity | undefined;
		if (booking.premise_id) {
			premise = await this.premisesService.readOne(booking.premise_id, {
				ext_id: true,
			});
		}

		return {
			url: `https://1c.tarabanov.tech/crm/hs/bpm/deal/${lead?.ext_id}/reservation`,
			method: "POST",
			data: {
				paymentMethod: booking.purchase_option.toUpperCase(),
				duration: 10,
				premiseId: premise?.ext_id,
				personId: client?.ext_id,
				channel: {
					agentId: agent?.ext_id,
				},
			},
		};
	}
}
