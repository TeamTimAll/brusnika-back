import {
	Controller,
	Get,
	Inject,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { SearchDto } from "./dto/Search.dto";
import { SearchService } from "./search.service";

@ApiTags("Global Search")
@Controller("search")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class SearchController {
	constructor(@Inject() private readonly searchService: SearchService) {}

	@Get()
	search(@Query() dto: SearchDto, @User() user: ICurrentUser) {
		return this.searchService.search(dto, user);
	}
}
