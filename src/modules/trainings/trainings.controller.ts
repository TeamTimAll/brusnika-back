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

import { CreateTrainingsMetaDataDto } from "./dto/trainings.create.dto";
import { LikeTrainingsMetaDataDto } from "./dto/trainings.dto";
import { UpdateTrainingsMetaDataDto } from "./dto/trainings.update.dto";
import { CreateTrainingsCategoriesMetaDataDto } from "./modules/categories/dto/categories.dto";
import { TrainingsService } from "./trainings.service";

@ApiTags("Trainings")
@Controller("trainings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class TrainingsController {
	constructor(private service: TrainingsService) {}

	@Get()
	@ApiOperation({ summary: "Get all trainings" })
	async getAllTrainings() {
		return this.service.readAll();
	}

	@Post()
	@ApiOperation({ summary: "create trainings" })
	async createTrainings(
		@Body() dto: CreateTrainingsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.service.create(dto.data, user);
	}

	@Post("like")
	@ApiOperation({ summary: "like trainings" })
	async likeTrainings(
		@Body() dto: LikeTrainingsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.service.likeTrainings(dto.data, user);
	}

	@Put(":id")
	@ApiOperation({ summary: "update trainings" })
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
	async createCategories(@Body() dto: CreateTrainingsCategoriesMetaDataDto) {
		return await this.service.createTrainingsCategory(dto.data);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get trainings by id" })
	async getTrainingsById(
		@Query("id") id: number,
		@User() user: ICurrentUser,
	) {
		return this.service.readOne(id, user);
	}
}
