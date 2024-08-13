import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { LikedResponseMetaDataDto } from "../../common/dtos/likeResponse.dto";
import { RoleType } from "../../constants";
import { ApiDtoResponse, ApiErrorResponse, User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateTrainingsMetaDataDto } from "./dto/CreateTrainings.dto";
import { LikeTrainingsMetaDataDto } from "./dto/LikeTrainings.dto";
import { UpdateTrainingCategoryMetaDataDto } from "./dto/UpdateTrainingCategory.dto";
import { UpdateTrainingsMetaDataDto } from "./dto/UpdateTrainings.dto";
import { CreateTrainingCategoryMetaDataDto } from "./dto/categories.dto";
import {
	TrainingArrayMetaDataDto,
	TrainingMetaDataDto,
} from "./dto/trainings.dto";
import { TrainingCategoryNotFoundError } from "./errors/TrainingsCategoryNotFound.error";
import { TrainingsService as TrainingService } from "./trainings.service";
import { FilterTrainingDto } from "./dto/FilterTraining.dto";

@ApiTags("Trainings")
@Controller("trainings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class TrainingController {
	constructor(private service: TrainingService) {}

	@Get()
	@ApiOperation({ summary: "Get all trainings" })
	@ApiDtoResponse(TrainingArrayMetaDataDto, HttpStatus.OK)
	async readAll(@Query() dto: FilterTrainingDto) {
		return this.service.readAll(dto);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post()
	@ApiOperation({
		summary: "create trainings",
		description: `### Training yasash
		\n **data** ma'lumotlari:
		\n - **title** - [required]
		\n - **content** - [required]
		\n - **cover_image** - [required]
		\n - **primary_category_id** - [optional]
		\n - **second_category_id** - [optional]
		\n - **is_like_enabled** - [required]
		\n - **is_copy_enabled** - [required]
		\n - **is_extra_like_enabled** - [optional]
		\n - **extra_like_icon** - [optional]`,
	})
	@ApiDtoResponse(TrainingMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(
		TrainingCategoryNotFoundError,
		"[primary_category_id | second_category_id]: 'id'",
	)
	async create(
		@Body() dto: CreateTrainingsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.service.create(dto.data, user);
	}

	@Post("toggle-like")
	@ApiOperation({
		summary: "toggle like",
		description: `### Toggle like - like bosishni o'chirib yoqish
		\n - training_id - training id'si`,
	})
	@ApiDtoResponse(LikedResponseMetaDataDto, HttpStatus.CREATED)
	async toggleLike(
		@Body() dto: LikeTrainingsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.service.toggleLike(dto.data, user);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Put(":id")
	@ApiOperation({
		summary: "update trainings",
		description: `### Training yangilash
		\n **data** ma'lumotlari:
		\n - **title** - [required]
		\n - **content** - [required]
		\n - **cover_image** - [required]
		\n - **primary_category_id** - [optional]
		\n - **second_category_id** - [optional]
		\n - **is_like_enabled** - [required]
		\n - **is_copy_enabled** - [required]
		\n - **is_extra_like_enabled** - [optional]
		\n - **extra_like_icon** - [optional]`,
	})
	async update(
		@Param("id") id: number,
		@Body() dto: UpdateTrainingsMetaDataDto,
	) {
		return this.service.update(id, dto.data);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Delete(":id")
	@ApiOperation({
		summary: "Delete trainings",
		description: `### Training yangilash
		\n **param** ma'lumotlari:
		\n - **id** - [required] training category id'si`,
	})
	async delete(@Param("id") id: number) {
		return this.service.delete(id);
	}

	@Get("categories")
	@ApiOperation({ summary: "Get all trainings categories" })
	async getCategories() {
		return await this.service.getCategories();
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Put("categories/:id")
	@ApiOperation({
		summary: "Update trainings categories",
		description: `### Training categoriyasini yangilash
		\n **param** ma'lumotlari:
		\n - **id** - [required] training category id'si
		\n **data** ma'lumotlari:
		\n - **name** - [required] categoriya nomi`,
	})
	@ApiDtoResponse(TrainingMetaDataDto, HttpStatus.OK)
	updateCategory(
		@Param("id") id: number,
		@Body() dto: UpdateTrainingCategoryMetaDataDto,
	) {
		return this.service.updateCategory(id, dto.data);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Delete("categories/:id")
	@ApiOperation({
		summary: "Delete trainings categories",
		description: `### Training categoriyasini o'chirish
		\n **param** ma'lumotlari:
		\n - **id** - [required] training category id'si`,
	})
	@ApiDtoResponse(TrainingMetaDataDto, HttpStatus.OK)
	deleteCategory(@Param("id") id: number) {
		return this.service.deleteCategory(id);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post("categories")
	@ApiOperation({ summary: "Create trainings categories" })
	async createCategory(@Body() dto: CreateTrainingCategoryMetaDataDto) {
		return await this.service.createCategory(dto.data);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get trainings by id" })
	@ApiDtoResponse(TrainingMetaDataDto, HttpStatus.OK)
	async readOne(@Param("id") id: number, @User() user: ICurrentUser) {
		return this.service.readOne(id, user);
	}
}
