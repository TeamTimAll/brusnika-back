import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Put,
	Post,
	Delete,
	InternalServerErrorException,
	HttpException,
	Query,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { UUIDParam } from "../../decorators";
import { CreateBookingsDto } from "./dtos/create-bookings.dto";
import { BookingsDto } from "./dtos/bookings.dto";
import { UpdateBookingsDto } from "./dtos/update-bookings.dto";
import { BookingsService } from "./bookings.service";
import { Uuid } from "boilerplate.polyfill";
import { BaseDto } from "../../common/base/base_dto";

@Controller("/bookings")
@ApiTags("Bookings")
export class BookingsController {
	constructor(private service: BookingsService) {}

	@ApiOperation({ summary: "Create a section" })
	@ApiResponse({ status: HttpStatus.CREATED, type: BookingsDto })
	@Post()
	async createsection(
		@Body() createBookingsDto: CreateBookingsDto,
	): Promise<any> {
		try {
			return await this.service.create(createBookingsDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Get all Bookings" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(new BaseDto()),
		},
	})
	@ApiQuery({ name: "premise_id", required: false })
	@Get("/")
	async getBookings(@Query("premise_id") premise_id: Uuid): Promise<any> {
		try {
			if (premise_id) {
				return await this.service.r_findAll({ where: { premise_id } });
			}
			return await this.service.r_findAll();
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Get a single section by ID" })
	@ApiResponse({ status: HttpStatus.OK, type: BookingsDto })
	@Get(":id")
	async getSinglesection(@UUIDParam("id") id: Uuid): Promise<any> {
		try {
			return await this.service.findOne(id);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Update a section by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async updatesection(
		@UUIDParam("id") id: Uuid,
		@Body() updateBookingsDto: UpdateBookingsDto,
	): Promise<any> {
		try {
			await this.service.update(id, updateBookingsDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Delete a section by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deletesection(@UUIDParam("id") id: Uuid): Promise<any> {
		try {
			await this.service.remove(id);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	private handleException(error: any): HttpException {
		if (error.status) {
			return new HttpException(
				error.message ? error.message : error.response,
				error.status,
			);
		} else {
			console.error(error.message);
			return new InternalServerErrorException("Internal server error");
		}
	}
}
