import {
	Body,
	Controller,
	Delete,
	Get,
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

import { ApiErrorResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";

import { BookingsService } from "./bookings.service";
import { NotBookedPremisesFilter } from "./dtos/NotBookedPremisesFilter.dto";
import { CreateBookingsMetaDataDto } from "./dtos/create-bookings.dto";
import { UpdateBookingsMetaDataDto } from "./dtos/update-bookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";

@ApiTags("Bookings")
@Controller("/bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class BookingsController {
	constructor(private service: BookingsService) {}

	@ApiOperation({ summary: "Create a booking" })
	@ApiErrorResponse(PremiseNotFoundError, 'id: "id"')
	@Post()
	create(@User() user: ICurrentUser, @Body() dto: CreateBookingsMetaDataDto) {
		return this.service.create(dto.data, user);
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
