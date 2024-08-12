import {
	Body,
	Controller,
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
import { ApiDtoResponse, ApiErrorResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateTrainingsMetaDataDto } from "./dto/CreateTrainings.dto";
import { LikeTrainingsMetaDataDto } from "./dto/LikeTrainings.dto";
import { UpdateTrainingsMetaDataDto } from "./dto/UpdateTrainings.dto";
import { CreateTrainingCategoryMetaDataDto } from "./dto/categories.dto";
import {
	TrainingArrayMetaDataDto,
	TrainingMetaDataDto,
} from "./dto/trainings.dto";
import { TrainingCategoryNotFoundError } from "./errors/TrainingsCategoryNotFound.error";
import { TrainingsService as TrainingService } from "./trainings.service";

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
	async readAll() {
		return this.service.readAll();
	}

	@Post()
	@ApiOperation({
		summary: "create trainings",
		description: `### Training yasash
		\n **data** ma'lumotlari:
		\n - **title** - [required] sarlavhasi
		\n - **content** - [required] mazmuni
		\n - **cover_image** - [required] qoplama rasmi
		\n - **primary_category_id** - [optional] birinchi kategoriyasi
		\n - **second_category_id** - [optional] ikkinchi kategoriyasi
		\n - **is_like_enabled** - [required] like qo'yib bo'ladimi yoki yo'qmi. True bo'lsa qilish mumkin va False aksi.
		\n - **is_extra_like_enabled** - [optional] ---
		\n - **extra_like_icon** - [optional] ---`,
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

	@Put(":id")
	@ApiOperation({
		summary: "update trainings",
		description: `### Training yangilash
		\n **data** ma'lumotlari:
		\n - **title** - [optional] sarlavhasi
		\n - **content** - [optional] mazmuni
		\n - **cover_image** - [optional] qoplama rasmi`,
	})
	async update(
		@Param("id") id: number,
		@Body() dto: UpdateTrainingsMetaDataDto,
	) {
		return this.service.update(id, dto.data);
	}

	@Get("categories")
	@ApiOperation({ summary: "Get all trainings categories" })
	async getCategories() {
		return await this.service.getCategories();
	}

	@Post("categories")
	@ApiOperation({ summary: "Create trainings categories" })
	async createCategory(@Body() dto: CreateTrainingCategoryMetaDataDto) {
		return await this.service.createCategory(dto.data);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get trainings by id" })
	@ApiDtoResponse(TrainingMetaDataDto, HttpStatus.OK)
	async readOne(@Query("id") id: number, @User() user: ICurrentUser) {
		return this.service.readOne(id, user);
	}
}
