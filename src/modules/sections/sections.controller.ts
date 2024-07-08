import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";

import { CreateSectionsDto } from "./dtos/create-sections.dto";
import { SectionsDto } from "./dtos/sections.dto";
import { UpdateSectionsDto } from "./dtos/update-sections.dto";
import { SectionsEntity } from "./sections.entity";
import { SectionsService } from "./sections.service";

@Controller("/sections")
@ApiTags("Sections")
export class SectionsController {
	constructor(private service: SectionsService) {}

	@ApiOperation({ summary: "Create a section" })
	@ApiResponse({ status: HttpStatus.CREATED, type: SectionsDto })
	@Post()
	async createsection(@Body() createSectionsDto: CreateSectionsDto) {
		return await this.service.create(createSectionsDto);
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
	async getSections(@Query("building_id") building_id: number) {
		if (building_id) {
			return await this.service.r_findAll({ where: { building_id } });
		}
		return await this.service.r_findAll();
	}

	@ApiOperation({ summary: "Get a single section by ID" })
	@ApiResponse({ status: HttpStatus.OK, type: SectionsDto })
	@Get(":id")
	async getSinglesection(@Param("id") id: number) {
		return await this.service.findOne(id);
	}

	@ApiOperation({ summary: "Update a section by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async updatesection(
		@Param("id") id: number,
		@Body() updateSectionsDto: UpdateSectionsDto,
	) {
		await this.service.update(id, updateSectionsDto);
	}

	@ApiOperation({ summary: "Delete a section by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deletesection(@Param("id") id: number) {
		await this.service.remove(id);
	}
}
