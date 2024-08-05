import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateNewsMetaDataDto } from "./dto/news.create.dto";
import { LikeNewsMetaDataDto } from "./dto/news.dto";
import { UpdateNewsMetaDataDto } from "./dto/news.update.dto";
import { CreateNewsCategoriesMetaDataDto } from "./modules/categories/dto/categories.dto";
import { NewsService } from "./news.service";

@ApiTags("News")
@Controller("news")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class NewsController {
	constructor(private service: NewsService) {}

	@Get()
	@ApiOperation({ summary: "Get all news" })
	async getAllNews() {
		return this.service.readAll();
	}

	@Post()
	@ApiOperation({ summary: "create news" })
	async createNews(
		@Body() dto: CreateNewsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.service.create(dto.data, user);
	}

	@Post("toggle-like")
	@ApiOperation({ summary: "like news" })
	async toggleLike(
		@Body() dto: LikeNewsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.service.toggleLike(dto.data, user);
	}

	@Put(":id")
	@ApiOperation({ summary: "update news" })
	async updateNews(
		@Param("id") id: number,
		@Body() dto: UpdateNewsMetaDataDto,
	) {
		return this.service.update(id, dto.data);
	}

	@Get("categories")
	@ApiOperation({ summary: "Get all news categories" })
	async getCategories() {
		return await this.service.getCategories();
	}

	@Get("banner")
	@ApiOperation({ summary: "Get all news banner" })
	async banner() {
		return await this.service.banner();
	}

	@Post("categories")
	@ApiOperation({ summary: "Create news categories" })
	async createCategories(@Body() body: CreateNewsCategoriesMetaDataDto) {
		return await this.service.createNewsCategory(body.data);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get news by id" })
	async getNewsById(@Query("id") id: number, @User() user: ICurrentUser) {
		return this.service.readOne(id, user);
	}
}
