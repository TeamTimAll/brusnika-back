import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ApiDtoResponse, ApiErrorResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { AnalyticsService } from "../analytics/analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";

import { BookingsService } from "./bookings.service";
import { BookingMetaDataDto } from "./dtos/Booking.dto";
import { CreateBookingsMetaDataDto } from "./dtos/CreateBookings.dto";
import { NotBookedPremisesFilter } from "./dtos/NotBookedPremisesFilter.dto";
import { UpdateBookingsMetaDataDto } from "./dtos/UpdateBookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";
import { MaxCreatableBookingCountReachedError } from "./errors/MaxCreatableBookingCountReached.error";

@ApiTags("Bookings")
@Controller("/bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class BookingsController {
	constructor(
		private service: BookingsService,
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@ApiOperation({ summary: "Create a booking" })
	@ApiErrorResponse(PremiseNotFoundError, 'id: "id"')
	@ApiErrorResponse(MaxCreatableBookingCountReachedError, "count: 0")
	@ApiDtoResponse(BookingMetaDataDto, HttpStatus.CREATED)
	@Post()
	async create(
		@User() user: ICurrentUser,
		@Body() dto: CreateBookingsMetaDataDto,
	) {
		const res = await this.service.create(dto.data, user);
		await this.analyticsService.incrementCreatedCount(user.analytics_id!);
		return res;
	}

	@ApiQuery({
		name: "client_id",
		description: " client id (optional if not provided  or empty)",
		required: false,
	})
	@ApiOperation({ summary: "Get all bookings" })
	@Get()
	@ApiErrorResponse(BookingNotFoundError, "'name' booking not found")
	async getBookings(
		@User() user: ICurrentUser,
		@Query("client_id") _client_id: string,
	) {
		return await this.service.readAll(user);
	}

	@ApiOperation({ summary: "Update a booking by ID" })
	@Put(":id")
	async updateCity(
		@Param("id") id: number,
		@Body() dto: UpdateBookingsMetaDataDto,
	) {
		return await this.service.update(id, dto.data);
	}

	@ApiOperation({ summary: "Delete a booking by ID" })
	@Delete(":id")
	async deleteCity(@Param("id") id: number) {
		return await this.service.delete(id);
	}

	@Get("/not-booked-premises")
	async readAllNotBookedPremises(@Query() dto: NotBookedPremisesFilter) {
		return await this.service.readAllNotBookedPremises(dto);
	}
}
