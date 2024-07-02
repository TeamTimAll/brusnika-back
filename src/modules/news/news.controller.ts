import {
	Controller,
	Get,
	Body,
	Post,
	Put,
	HttpStatus,
	UseGuards,
	Query,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { User } from "../../decorators";
import { BaseDto } from "../../common/base/base_dto";

import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/news.create.dto";
import { UpdateNewsDto } from "./dto/news.update.dto";
import { NewsEntity } from "./news.entity";
import { LikeNewsDto } from "./dto/news.dto";
import { CreateNewsCategoriesDto } from "./modules/categories/dto/categories.dto";

@Controller("news")
@ApiTags("News")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NewsController {
	constructor(private service: NewsService) {}

	@Get()
	@ApiOperation({ summary: "Get all news" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(new BaseDto(), [
				NewsEntity.toDto({}),
			]),
		},
	})
	async getAllNews() {
		return this.service.r_findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get news by id" })
	async getNewsById(@Query("id") id: string, @User() user: ICurrentUser) {
		return this.service.r_findOne(id, user);
	}

	@Post()
	@ApiOperation({ summary: "create news" })
	async createNews(@Body() body: CreateNewsDto, @User() user: ICurrentUser) {
		return this.service.createNews(body, user);
	}

	@Post("like")
	@ApiOperation({ summary: "like news" })
	async likeNews(@Body() body: LikeNewsDto, @User() user: ICurrentUser) {
		return this.service.likeNews(body, user);
	}

	@Put()
	@ApiOperation({ summary: "update news" })
	async updateNews(@Body() body: UpdateNewsDto) {
		return this.service.update(body.id, body);
	}

	@Get("categories")
	@ApiOperation({ summary: "Get all news categories" })
	async getCategories() {
		return await this.service.getCategories();
	}

	@Post("categories")
	@ApiOperation({ summary: "Create news categories" })
	async createCategories(@Body() body: CreateNewsCategoriesDto) {
		return await this.service.createNewsCategory(body);
	}
}
