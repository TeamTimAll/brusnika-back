import { Inject, Injectable } from "@nestjs/common";

import { ICurrentUser } from "interfaces/current-user.interface";

import { BaseDto } from "../../common/base/base_dto";
import { ClientService } from "../client/client.service";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremiseEntity } from "../premises/premises.entity";
import { PremisesService } from "../premises/premises.service";
import { SettingsService } from "../settings/settings.service";

import { BookingRepository } from "./booking.repository";
import { BookingsEntity as BookingEntity } from "./bookings.entity";
import { CreateBookingsDto } from "./dtos/CreateBookings.dto";
import { NotBookedPremisesFilter } from "./dtos/NotBookedPremisesFilter.dto";
import { UpdateBookingsDto } from "./dtos/UpdateBookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";
import { MaxCreatableBookingCountReachedError } from "./errors/MaxCreatableBookingCountReached.error";

export interface IUserCreation {
	user_created_count: number;
	max_user_creation_limit: number;
	remaining_user_creation_limit: number;
}

@Injectable()
export class BookingsService {
	constructor(
		@Inject()
		private bookingRepository: BookingRepository,
		@Inject() private premiseService: PremisesService,
		@Inject() private clientService: ClientService,
		@Inject() private settingsService: SettingsService,
	) {}

	get repository(): BookingRepository {
		return this.bookingRepository;
	}

	async create(dto: CreateBookingsDto, user: ICurrentUser) {
		if (typeof dto.premise_id !== "undefined") {
			await this.premiseService.checkExists(dto.premise_id);
		}
		if (typeof dto.client_id !== "undefined") {
			await this.clientService.checkExists(dto.client_id);
		}
		let userCreatedCount = await this.bookingRepository.count({
			where: {
				create_by_id: user.user_id,
			},
		});
		const settings = await this.settingsService.read();
		if (userCreatedCount >= settings.booking_limit) {
			throw new MaxCreatableBookingCountReachedError(
				`count: ${userCreatedCount}; limit: ${settings.booking_limit}`,
			);
		}
		userCreatedCount += 1; // One increased. Because created users count is 0
		const booking = this.bookingRepository.create(dto);
		booking.agent_id = user.user_id;
		booking.create_by_id = user.user_id;
		const metaData = BaseDto.create<BookingEntity>();
		metaData.data = await this.bookingRepository.save(booking);
		metaData.meta.data = {
			user_created_count: userCreatedCount,
			max_user_creation_limit: settings.booking_limit,
			remaining_user_creation_limit:
				settings.booking_limit - userCreatedCount,
		} as IUserCreation;
		return metaData;
	}

	async readAll(user: ICurrentUser): Promise<BookingEntity[]> {
		return this.bookingRepository.readAll({
			where: { agent_id: user.user_id },
		});
	}

	async readOne(id: number): Promise<BookingEntity> {
		const findOne = await this.bookingRepository.readOne({
			where: { id },
		});
		if (!findOne) {
			throw new BookingNotFoundError(`'${id}' not found`);
		}
		return findOne;
	}

	readAllNotBookedPremises(
		filter: NotBookedPremisesFilter,
	): Promise<PremiseEntity[]> {
		let query = this.premiseService.repository
			.createQueryBuilder("p")
			.select("*")
			.where(
				"id NOT IN (SELECT DISTINCT premise_id FROM bookings WHERE premise_id IS NOT NULL)",
			);

		if (filter.type) {
			query = query.andWhere("p.type = :type", {
				type: filter.type,
			});
		}

		if (filter.building_id) {
			query = query.andWhere("p.building_id = :building_id", {
				building_id: filter.building_id,
			});
		}
		return query.getRawMany();
	}

	async update(id: number, dto: UpdateBookingsDto): Promise<BookingEntity> {
		const foundBooking = await this.readOne(id);
		if (typeof dto.premise_id !== "undefined") {
			const foundPremise = await this.premiseService.readOne(
				dto.premise_id,
			);
			if (!foundPremise) {
				throw new PremiseNotFoundError(`id: ${dto.premise_id}`);
			}
		}
		if (typeof dto.client_id !== "undefined") {
			await this.clientService.checkExists(dto.client_id);
		}
		const mergedBooking = this.bookingRepository.merge(foundBooking, dto);
		return await this.bookingRepository.save(mergedBooking);
	}

	async delete(id: number): Promise<BookingEntity> {
		const foundBooking = await this.readOne(id);
		await this.bookingRepository.delete(foundBooking.id);
		return foundBooking;
	}
}
