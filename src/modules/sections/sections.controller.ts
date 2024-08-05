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
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { CreateSectionsMetaDataDto } from "./dtos/CreateSections.dto";
import { SectionsDto } from "./dtos/Sections.dto";
import { UpdateSectionsMetaDataDto } from "./dtos/UpdateSections.dto";
import { SectionsService } from "./sections.service";

@Controller("/sections")
@ApiTags("Sections")
@UseInterceptors(TransformInterceptor)
export class SectionsController {
	constructor(private service: SectionsService) {}

	@ApiOperation({ summary: "Create a section" })
	@ApiResponse({ status: HttpStatus.CREATED, type: SectionsDto })
	@Post()
	async createsection(@Body() dto: CreateSectionsMetaDataDto) {
		return await this.service.create(dto.data);
	}

	@ApiOperation({ summary: "Get all Sections" })
	@ApiQuery({ name: "building_id", required: false })
	@Get()
	async getSections(@Query("building_id") building_id: number) {
		return await this.service.readAll(building_id);
	}

	@ApiOperation({ summary: "Get a single section by ID" })
	@ApiResponse({ status: HttpStatus.OK, type: SectionsDto })
	@Get(":id")
	async getSinglesection(@Param("id") id: number) {
		return await this.service.readOne(id);
	}

	@ApiOperation({ summary: "Update a section by ID" })
	@ApiAcceptedResponse()
	@Put(":id")
	async updatesection(
		@Param("id") id: number,
		@Body() dto: UpdateSectionsMetaDataDto,
	) {
		return await this.service.update(id, dto.data);
	}

	@ApiOperation({ summary: "Delete a section by ID" })
	@ApiAcceptedResponse()
	@Delete(":id")
	async deletesection(@Param("id") id: number) {
		return await this.service.delete(id);
	}
}
