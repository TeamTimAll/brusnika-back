import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiBearerAuth,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { RoleType } from "../../constants";
import { ApiDtoResponse, User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateNewsMetaDataDto } from "./dto/CreateNews.dto";
import { CreateNewsCategoriesMetaDataDto } from "./dto/CreateNewsCategories.dto";
import { LikeNewsMetaDataDto } from "./dto/LikeNews.dto";
import { NewsSearchDto } from "./dto/NewsSearch.dto";
import { UpdateNewsMetaDataDto } from "./dto/UpdateNews.dto";
import { ReadAllNewsDto } from "./dto/read-all-news.dto";
import { ReadAllBannerNewsDto, ToggleNewsMetaDataDto } from "./dto";
import { NewsMetaDataDto } from "./dto/news.dto";
import { UpdateNewsCategoryMetaDataDto } from "./dto/update-news-category.dto";
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
	async getAllNews(
		@User() user: ICurrentUser,
		@Query() query: ReadAllNewsDto,
	) {
		return this.service.readAll(user, query);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post()
	@ApiOperation({ summary: "create news" })
	async createNews(
		@Body() dto: CreateNewsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.service.create(dto.data, user);
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
	@Post("toggle-draft")
	@ApiOperation({ summary: "toggle draft events" })
	async toggleDraft(@Body() dto: ToggleNewsMetaDataDto) {
		return await this.service.toggleDraft(dto.data);
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Put("categories/:id")
	@ApiOperation({
		summary: "Update news categories",
		description: `### News categoriyasini yangilash
		\n **param** ma'lumotlari:
		\n - **id** - [required] news category id'si
		\n **data** ma'lumotlari:
		\n - **name** - [required] categoriya nomi`,
	})
	@ApiDtoResponse(NewsMetaDataDto, HttpStatus.OK)
	updateCategory(
		@Param("id") id: number,
		@Body() dto: UpdateNewsCategoryMetaDataDto,
	) {
		return this.service.updateCategory(id, dto.data);
	}
	@Get("categories")
	@ApiOperation({ summary: "Get all news categories" })
	async getCategories() {
		return await this.service.getCategories();
	}

	@Get("search")
	@ApiOperation({ summary: "Get all news categories" })
	async search(@Query() dto: NewsSearchDto, @User() user: ICurrentUser) {
		return await this.service.search(dto, user);
	}

	@Get("banner")
	@ApiOperation({ summary: "Get all news banner" })
	async banner(
		@User() user: ICurrentUser,
		@Query() query: ReadAllBannerNewsDto,
	) {
		return await this.service.banner(user, query);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post("categories")
	@ApiOperation({ summary: "Create news categories" })
	async createCategories(@Body() body: CreateNewsCategoriesMetaDataDto) {
		return await this.service.createNewsCategory(body.data);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get news by id" })
	async getNewsById(@Param("id") id: number, @User() user: ICurrentUser) {
		return this.service.readOne(id, user);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Delete("categories/:id")
	@ApiOperation({
		summary: "Delete news categories",
		description: `### News categoriyasini o'chirish
		\n **param** ma'lumotlari:
		\n - **id** - [required] news category id'si`,
	})
	@ApiDtoResponse(NewsMetaDataDto, HttpStatus.OK)
	deleteCategory(@Param("id") id: number) {
		return this.service.deleteCategory(id);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	async deleteNews(@Param("id") id: number) {
		return await this.service.remove(id);
	}
}
