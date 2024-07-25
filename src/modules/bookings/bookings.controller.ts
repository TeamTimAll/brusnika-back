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
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { BaseDto } from "../../common/base/base_dto";
import { User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { BookingsService } from "./bookings.service";
import { NotBookedPremisesFilter } from "./dtos/NotBookedPremisesFilter.dto";
import { CreateBookingsDto } from "./dtos/create-bookings.dto";
import { UpdateBookingsDto } from "./dtos/update-bookings.dto";
import { BookingNotFoundError } from "./errors/BookingsNotFound.error";

@ApiTags("Bookings")
@Controller("/bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
	constructor(private service: BookingsService) {}

	// -------------------------------@Post()-----------------------------------
	@ApiOperation({ summary: "Create a booking" })
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
		@Query("client_id") _client_id: string,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());

		metaData.data = await this.service.new_findAll(user);
		return metaData;
	}
	// ---------------------------@Put(":id")-----------------------------------
	@ApiOperation({ summary: "Update a booking by ID" })
	@Put(":id")
	async updateCity(
		@Param("id") id: number,
		@Body() updateBookingsDto: UpdateBookingsDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const updatedCity = await this.service.r_update(id, updateBookingsDto);
		metaData.data = updatedCity;
		return metaData;
	}
	// ---------------------------@Delete(":id")-------------------------------
	@ApiOperation({ summary: "Delete a booking by ID" })
	@Delete(":id")
	async deleteCity(@Param("id") id: number) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.r_remove(id);
		return metaData;
	}
	// -----------------------------------------------------------------------
	@Get("/not-booked-premises")
	async readAllNotBookedPremises(@Query() dto: NotBookedPremisesFilter) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.readAllNotBookedPremises(dto);
		return metaData;
	}
}
