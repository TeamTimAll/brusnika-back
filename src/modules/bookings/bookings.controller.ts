import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { Uuid } from "boilerplate.polyfill";
import { ICurrentUser } from "interfaces/current-user.interface";

import { BaseDto } from "../../common/base/base_dto";
import { UUIDParam, User } from "../../decorators";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { BookingsEntity } from "./bookings.entity";
import { BookingsService } from "./bookings.service";
import { CreateBookingsDto } from "./dtos/create-bookings.dto";
import { UpdateBookingsDto } from "./dtos/update-bookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";

@ApiTags("Bookings")
@Controller("/bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BookingsController {
	constructor(private service: BookingsService) {}

	// -------------------------------@Post()-----------------------------------
	@ApiOperation({ summary: "Create a booking" })
	@ApiResponse({
		status: HttpStatus.CREATED,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto(),
				BookingsEntity.toDto({}),
			),
		},
	})
	@Post()
	createCity(@User() user: ICurrentUser, @Body() dto: CreateBookingsDto) {
		dto.agent_id = user.user_id;
		return this.service.create(dto);
	}
	// ------------------------------@Get()-------------------------------------

	@ApiQuery({
		name: "client_id",
		description: " client id (optional if not provided  or empty)",
		required: false,
	})
	@ApiOperation({ summary: "Get all bookings" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(new BaseDto(), [
				BookingsEntity.toDto({}),
			]),
		},
	})
	@Get()
	@ApiResponse({
		status: new BookingNotFoundError().status,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
				new BookingNotFoundError("'name' booking not found"),
			),
		},
	})
	async getBookings(
		@User() user: ICurrentUser,
		@Query("client_id") _client_id: Uuid,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());

		metaData.data = await this.service.new_findAll(user);
		return metaData;
	}
	// ----------------------------@Get(":id")----------------------------------
	@ApiOperation({ summary: "Get a single booking by ID" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto(),
				BookingsEntity.toDto({}),
			),
		},
	})
	@ApiResponse({
		status: new BookingNotFoundError().status,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()).setPrompt(
				new BookingNotFoundError("'name' booking not found"),
			),
		},
	})
	@Get(":id")
	async getSingleBooking(
		@UUIDParam("id")
		id: Uuid,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const foundCity = await this.service.r_findOne(id);
		metaData.data = foundCity;
		return metaData;
	}
	// ---------------------------@Put(":id")-----------------------------------
	@ApiOperation({ summary: "Update a booking by ID" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto<BookingsEntity>(),
				BookingsEntity.toDto({}),
			),
		},
	})
	@Put(":id")
	async updateCity(
		@UUIDParam("id") id: Uuid,
		@Body() updateBookingsDto: UpdateBookingsDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const updatedCity = await this.service.r_update(id, updateBookingsDto);
		metaData.data = updatedCity;
		return metaData;
	}
	// ---------------------------@Delete(":id")-------------------------------
	@ApiOperation({ summary: "Delete a booking by ID" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(
				new BaseDto(),
				BookingsEntity.toDto({}),
			),
		},
	})
	@Delete(":id")
	async deleteCity(@UUIDParam("id") id: Uuid) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.r_remove(id);
		return metaData;
	}
	// -----------------------------------------------------------------------
}
