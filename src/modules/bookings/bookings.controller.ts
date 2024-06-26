import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Post,
	Put,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";
import { UUIDParam } from "../../decorators";

import { BookingsEntity } from "./bookings.entity";
import { BookingsService } from "./bookings.service";
import { CreateBookingsMetaDataDto } from "./dtos/create-bookings.dto";
import { UpdateBookingsMetaDataDto } from "./dtos/update-bookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";

@ApiTags("Bookings")
@Controller("/bookings")
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
	createCity(@Body() createBookingsDto: CreateBookingsMetaDataDto) {
		const dto = createBookingsDto.data;
		return this.service.create(dto);
	}
	// ------------------------------@Get()-------------------------------------

	@ApiQuery({
		name: "name",
		description: " booking Name (optional if not provided  or empty)",
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
	async getBookings() {
		const metaData = BaseDto.createFromDto(new BaseDto());

		metaData.data = await this.service.r_findAll();
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
	async getSingleCity(
		@UUIDParam("id")
		id: string,
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
		@UUIDParam("id") id: string,
		@Body() updateBookingsDto: UpdateBookingsMetaDataDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const dto = updateBookingsDto.data;
		const updatedCity = await this.service.r_update(id, dto);
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
	async deleteCity(@UUIDParam("id") id: string) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.r_remove(id);
		return metaData;
	}
	// -----------------------------------------------------------------------
}
