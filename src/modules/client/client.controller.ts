import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
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
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class ClientController {
	constructor(private clientService: ClientService) {}

	@Post()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async create(
		@User() user: ICurrentUser,
		@Body() dto: CreateClientMetaDataDto,
	) {
		dto.data.agent_id = user.user_id;
		return await this.clientService.create(dto.data);
	}

	@Get("/search")
	async quickSearch(
		@User() user: ICurrentUser,
		@Query() dto: ClientQuickSearchDto,
	) {
		return await this.clientService.quickSearch(dto.text, user);
	}

	@Get()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async readAll(@User() user: ICurrentUser, @Query() dto: FilterClientDto) {
		return await this.clientService.readAll(dto, user);
	}

	@Get("/search-from-bmpsoft")
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async searchFromBmpsoft(
		@User() user: ICurrentUser,
		@Query() dto: ClientSearchFromBmpsoft,
	) {
		return await this.clientService.searchFromBmpsoft(dto, user);
	}

	@Delete()
	@ApiOkResponse({ type: CreateClientMetaDataDto })
	async delete(@User() user: ICurrentUser, @Query() dto: DeleteClientDto) {
		return await this.clientService.delete(dto, user);
	}
}
