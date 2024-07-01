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
import { BaseDto } from "../../common/base/base_dto";

import { CreateSectionsDto } from "./dtos/create-sections.dto";
import { SectionsDto } from "./dtos/sections.dto";
import { UpdateSectionsDto } from "./dtos/update-sections.dto";
import { SectionsService } from "./sections.service";
import { SectionsEntity } from "./sections.entity";

@Controller("/sections")
@ApiTags("Sections")
export class SectionsController {
	constructor(private service: SectionsService) {}

	@ApiOperation({ summary: "Create a section" })
	@ApiResponse({ status: HttpStatus.CREATED, type: SectionsDto })
	@Post()
	async createsection(
		@Body() createSectionsDto: CreateSectionsDto,
	): Promise<any> {
		try {
			return await this.service.create(createSectionsDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Get all Sections" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(new BaseDto(), [
				SectionsEntity.toDto({
					name: "...",
				}),
			]),
		},
	})
	@ApiQuery({ name: "building_id", required: false })
	@Get("/")
	async getSections(@Query("building_id") building_id: string): Promise<any> {
		try {
			if (building_id) {
				return await this.service.r_findAll({ where: { building_id } });
			}
			return await this.service.r_findAll();
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Get a single section by ID" })
	@ApiResponse({ status: HttpStatus.OK, type: SectionsDto })
	@Get(":id")
	async getSinglesection(@UUIDParam("id") id: string): Promise<any> {
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
		@UUIDParam("id") id: string,
		@Body() updateSectionsDto: UpdateSectionsDto,
	): Promise<any> {
		try {
			await this.service.update(id, updateSectionsDto);
		} catch (error: any) {
			throw this.handleException(error);
		}
	}

	@ApiOperation({ summary: "Delete a section by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deletesection(@UUIDParam("id") id: string): Promise<any> {
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
