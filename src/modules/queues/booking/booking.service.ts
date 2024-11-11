import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { BookingsService } from "../../bookings/bookings.service";
import { UserService } from "../../user/user.service";
import { ClientService } from "../../client/client.service";
import { PremisesService } from "../../premises/premises.service";
import { BaseDto } from "../../../common/base/base_dto";
import { QueueService } from "../queue.service";
import { BookingsEntity } from "../../bookings/bookings.entity";
import { UserEntity } from "../../user/user.entity";
import { ClientEntity } from "../../client/client.entity";
import { PremiseEntity } from "../../premises/premises.entity";

import { BookingDto, BookingQueueDto } from "./dto";

@Injectable()
export class BookingQueueService {
	constructor(
		@Inject(forwardRef(() => BookingsService))
		private readonly bookingService: BookingsService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly premisesService: PremisesService,
		private readonly queueService: QueueService,
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

	async makeRequest(booking: BookingQueueDto) {
		const data: Pick<BaseDto<BookingQueueDto>, "data"> = {
			data: booking,
		};
		await this.queueService.send("url", data);
	}

	async requestStatusChange(dto: BookingDto) {
		const data: Pick<BaseDto<BookingDto>, "data"> = {
			data: dto,
		};

		await this.queueService.send("url", data);
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
			purchase_option: booking.purchase_option,
			status: booking.status,
			agent_ext_id: agent?.ext_id ?? null,
			client_ext_id: client?.ext_id ?? null,
			premise_ext_id: premise?.ext_id ?? null,
		};
	}
}
