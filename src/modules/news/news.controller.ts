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

import { RoleType } from "../../constants";
import { User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateNewsMetaDataDto } from "./dto/CreateNews.dto";
import { CreateNewsCategoriesMetaDataDto } from "./dto/CreateNewsCategories.dto";
import { LikeNewsMetaDataDto } from "./dto/LikeNews.dto";
import { UpdateNewsMetaDataDto } from "./dto/UpdateNews.dto";
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
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
