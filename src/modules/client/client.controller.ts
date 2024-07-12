import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";
import { User } from "../../decorators";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { ClientService } from "./client.service";
import { DeleteClientDto } from "./dto/client-delete.dto";
import {
	ClientQuickSearchDto,
	ClientSearchFromBmpsoft,
	FilterClientDto,
} from "./dto/client.search.dto";
import { CreateClientMetaDataDto } from "./dto/create.client.dto";

@ApiTags("Client")
@Controller("client")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ClientController {
	constructor(private clientService: ClientService) {}

	@Post()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async create(
		@User() user: ICurrentUser,
		@Body() dto: CreateClientMetaDataDto,
	) {
		const metaData = BaseDto.createFromDto(dto);
		dto.data.agent_id = user.user_id;
		metaData.data = await this.clientService.create(dto.data);
		return metaData;
	}

	@Get("/search")
	async quickSearch(
		@User() user: ICurrentUser,
		@Query() dto: ClientQuickSearchDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.clientService.quickSearch(dto.text, user);
		return metaData;
	}

	@Get()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async readAll(@User() user: ICurrentUser, @Query() dto: FilterClientDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const serviceResponse = await this.clientService.readAll(dto, user);
		metaData.data = serviceResponse.data;
		metaData.setLinks(serviceResponse.links);
		return metaData;
	}

	@Get("/search-from-bmpsoft")
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async searchFromBmpsoft(
		@User() user: ICurrentUser,
		@Query() dto: ClientSearchFromBmpsoft,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const serviceResponse = await this.clientService.searchFromBmpsoft(
			dto,
			user,
		);
		metaData.data = serviceResponse;
		return metaData;
	}

	@Delete()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async delete(@User() user: ICurrentUser, @Query() dto: DeleteClientDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const serviceResponse = await this.clientService.delete(dto, user);
		metaData.data = serviceResponse;
		return metaData;
	}
}
