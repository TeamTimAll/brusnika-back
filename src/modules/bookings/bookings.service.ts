import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ClientService } from "../client/client.service";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremisesEntity } from "../premises/premises.entity";
import { PremisesService } from "../premises/premises.service";

import { BookingsEntity } from "./bookings.entity";
import { NotBookedPremisesFilter } from "./dtos/NotBookedPremisesFilter.dto";
import { CreateBookingsDto } from "./dtos/create-bookings.dto";
import { UpdateBookingsDto } from "./dtos/update-bookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";
import { MaxCreatableBookingCountReachedError } from "./errors/MaxCreatableBookingCountReached.error";

const MAX_CREATABLE_BOOKING_COUNT = 5;

@Injectable()
export class BookingsService {
	constructor(
		@InjectRepository(BookingsEntity)
		private bookingRepository: Repository<BookingsEntity>,
		@Inject() private premiseService: PremisesService,
		@Inject() private clientService: ClientService,
	) {}

	async create(dto: CreateBookingsDto, user: ICurrentUser) {
		if (typeof dto.premise_id !== "undefined") {
			const foundPremise = await this.premiseService.readOne(
				dto.premise_id,
			);
			if (!foundPremise.id) {
				throw new PremiseNotFoundError(`id: ${dto.premise_id}`);
			}
		}
		if (typeof dto.client_id !== "undefined") {
			await this.clientService.readOne(dto.client_id);
		}
		const userCreatedCount = await this.bookingRepository.count({
			where: {
				create_by_id: user.user_id,
			},
		});
		if (userCreatedCount >= MAX_CREATABLE_BOOKING_COUNT) {
			throw new MaxCreatableBookingCountReachedError(
				`count: ${userCreatedCount}`,
			);
		}
		const booking = this.bookingRepository.create(dto);
		booking.agent_id = user.user_id;
		booking.create_by_id = user.user_id;
		return await this.bookingRepository.save(booking);
	}

	async readAll(user: ICurrentUser): Promise<BookingsEntity[]> {
		return this.bookingRepository.find({
			where: { agent_id: user.user_id },
		});
	}

	async readOne(id: number): Promise<BookingsEntity> {
		const findOne = await this.bookingRepository.findOne({
			where: { id },
		});
		if (!findOne) {
			throw new BookingNotFoundError(`'${id}' not found`);
		}
		return findOne;
	}

	readAllNotBookedPremises(
		filter: NotBookedPremisesFilter,
	): Promise<PremisesEntity[]> {
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

	async update(id: number, dto: UpdateBookingsDto): Promise<BookingsEntity> {
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
			await this.clientService.readOne(dto.client_id);
		}
		const mergedBooking = this.bookingRepository.merge(foundBooking, dto);
		return await this.bookingRepository.save(mergedBooking);
	}

	async delete(id: number): Promise<BookingsEntity> {
		const foundBooking = await this.readOne(id);
		await this.bookingRepository.delete(foundBooking.id);
		return foundBooking;
	}
}
