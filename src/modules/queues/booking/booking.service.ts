import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { BookingsService } from "../../bookings/bookings.service";
import { ClientService } from "../../client/client.service";
import { BaseDto } from "../../../common/base/base_dto";
import { QueueService } from "../queue.service";
import { BookingsEntity } from "../../bookings/bookings.entity";
import { ClientEntity } from "../../client/client.entity";

import { BookingDto } from "./dto";
import { IBooking } from "./types/booking.type";

@Injectable()
export class BookingQueueService {
	constructor(
		@Inject(forwardRef(() => BookingsService))
		private readonly bookingService: BookingsService,
		// private readonly userService: UserService,
		private readonly clientService: ClientService,
		// private readonly premisesService: PremisesService,
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
		// let agent: UserEntity | undefined;
		// if (booking.agent_id) {
		// 	agent = await this.userService.readOne(booking.agent_id, {
		// 		ext_id: true,
		// 	});
		// }

		let client: ClientEntity | undefined;
		if (booking.client_id) {
			client = await this.clientService.readOne(booking.client_id, {
				ext_id: true,
			});
		}

		// let premise: PremiseEntity | undefined;
		// if (booking.premise_id) {
		// 	premise = await this.premisesService.readOne(booking.premise_id, {
		// 		ext_id: true,
		// 	});
		// }

		return {
			url: "https://1c.tarabanov.tech/crm/hs/ofo/",
			method: "POST",
			data: {
				contourId: "36cba4b9-1ef1-11e8-90e9-901b0ededf35",
				requestType: "reservation_paid",
				contacts: {
					name: client?.fullname,
					phone: client?.phone_number,
				},
				data: {
					flatIdC: "fafb8ccd-59aa-4509-a520-5d45e14f42c6",
					ga_client_id: "",
					metrika_client_id: "",
					payment_method: booking.purchase_option,
				},
				referer: "",
			},
		};
	}
}
