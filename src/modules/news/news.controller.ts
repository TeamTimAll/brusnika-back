import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateNewsDto } from "./dto/news.create.dto";
import { LikeNewsDto } from "./dto/news.dto";
import { UpdateNewsDto } from "./dto/news.update.dto";
import { CreateNewsCategoriesDto } from "./modules/categories/dto/categories.dto";
import { NewsService } from "./news.service";

@Controller("news")
@ApiTags("News")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class NewsController {
	constructor(private service: NewsService) {}

	@Get()
	@ApiOperation({ summary: "Get all news" })
	async getAllNews() {
		return this.service.r_findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get news by id" })
	async getNewsById(@Query("id") id: number, @User() user: ICurrentUser) {
		return this.service.r_findOne(id, user);
	}

	@Post()
	@ApiOperation({ summary: "create news" })
	async createNews(@Body() body: CreateNewsDto, @User() user: ICurrentUser) {
		return this.service.createNews(body, user);
	}

	@Post("toggle-like")
	@ApiOperation({ summary: "like news" })
	async toggleLike(@Body() body: LikeNewsDto, @User() user: ICurrentUser) {
		return this.service.toggleLike(body, user);
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
