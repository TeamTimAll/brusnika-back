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
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { ApiDtoResponse } from "../../decorators";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { CreateSectionsMetaDataDto } from "./dtos/CreateSections.dto";
import {
	ReadAllSectionFilterDto,
	ReadAllSectionMetaDataDto,
} from "./dtos/ReadAllSectionFilter.dto";
import { SectionDto } from "./dtos/Sections.dto";
import { UpdateSectionsMetaDataDto } from "./dtos/UpdateSections.dto";
import { SectionsService } from "./sections.service";

@Controller("/sections")
@ApiTags("Sections")
@UseInterceptors(TransformInterceptor)
export class SectionsController {
	constructor(private service: SectionsService) {}

	@ApiOperation({ summary: "Create a section" })
	@ApiResponse({ status: HttpStatus.CREATED, type: SectionDto })
	@Post()
	async createsection(@Body() dto: CreateSectionsMetaDataDto) {
		return await this.service.create(dto.data);
	}

	@ApiOperation({ summary: "Get all Sections" })
	@ApiDtoResponse(ReadAllSectionMetaDataDto, HttpStatus.OK)
	@Get()
	async getSections(@Query() dto: ReadAllSectionFilterDto) {
		return await this.service.readAll(dto.building_id);
	}

	@ApiOperation({ summary: "Get a single section by ID" })
	@ApiResponse({ status: HttpStatus.OK, type: SectionDto })
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
