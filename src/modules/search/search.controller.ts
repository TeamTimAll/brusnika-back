import {
	Controller,
	Get,
	Inject,
	Query,
	UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { TransformInterceptor } from "../../interceptors/transform.interceptor";

import { SearchDto } from "./dto/Search.dto";
import { SearchService } from "./search.service";

@ApiTags("Global Search")
@Controller("search")
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class SearchController {
	constructor(@Inject() private readonly searchService: SearchService) {}

	@Get()
	search(@Query() dto: SearchDto) {
		return this.searchService.search(dto.text);
	}
}
