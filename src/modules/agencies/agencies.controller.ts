import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Put,
	Post,
	Query,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { UUIDParam, User , ApiPageOkResponse } from "../../decorators";

import { CreateAgenciesDto } from "./dtos/create-agencies.dto";
import { AgenciesDto } from "./dtos/agencies.dto";
import { UpdateAgenciesDto } from "./dtos/update-agencies.dto";
import { AgenciesService } from "./agencies.service";

@Controller("/agencies")
@ApiTags("Agencies")
export class AgenciesController {
	constructor(private service: AgenciesService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: AgenciesDto })
	@Post()
	async createAgencies(
		@Body() createAgenciesDto: CreateAgenciesDto,
		@User() user: ICurrentUser,
	) {
		return await this.service.create(createAgenciesDto, user);
	}

	@Get()
	@ApiQuery({
		name: "name",
		description: " Agencies Name (optional if not provided  or empty)",
		required: false,
	})
	@ApiPageOkResponse({ type: AgenciesDto })
	async getAgencies(@Query("name") name: string): Promise<unknown> {
		if (name) {
			return this.service.findAllWithName(name);
		} else {
			return this.service.findAll();
		}
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: AgenciesDto })
	async getSingleAgencies(@UUIDParam("id") id: string): Promise<unknown> {
		return await this.service.findOne(id);
	}

	@Put(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	updateAgencies(
		@UUIDParam("id") id: string,
		@Body() updateAgenciesDto: UpdateAgenciesDto,
	): Promise<unknown> {
		return this.service.update(id, updateAgenciesDto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	async deleteAgencies(@UUIDParam("id") id: string): Promise<void> {
		await this.service.remove(id);
	}
}
