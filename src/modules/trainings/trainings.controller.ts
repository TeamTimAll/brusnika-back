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

import { CreateTrainingsDto } from "./dto/trainings.create.dto";
import { LikeTrainingsDto } from "./dto/trainings.dto";
import { UpdateTrainingsDto } from "./dto/trainings.update.dto";
import { CreateTrainingsCategoriesDto } from "./modules/categories/dto/categories.dto";
import { TrainingsService } from "./trainings.service";

@Controller("trainings")
@ApiTags("Trainings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingsController {
	constructor(private service: TrainingsService) {}

	@Get()
	@ApiOperation({ summary: "Get all trainings" })
	async getAllTrainings() {
		return this.service.r_findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get trainings by id" })
	async getTrainingsById(
		@Query("id") id: number,
		@User() user: ICurrentUser,
	) {
		return this.service.r_findOne(id, user);
	}

	@Post()
	@ApiOperation({ summary: "create trainings" })
	async createTrainings(
		@Body() body: CreateTrainingsDto,
		@User() user: ICurrentUser,
	) {
		return this.service.createTrainings(body, user);
	}

	@Post("like")
	@ApiOperation({ summary: "like trainings" })
	async likeTrainings(
		@Body() body: LikeTrainingsDto,
		@User() user: ICurrentUser,
	) {
		return this.service.likeTrainings(body, user);
	}

	@Put()
	@ApiOperation({ summary: "update trainings" })
	async updateTrainings(@Body() body: UpdateTrainingsDto) {
		return this.service.update(body.id, body);
	}

	@Get("categories")
	@ApiOperation({ summary: "Get all trainings categories" })
	async getCategories() {
		return await this.service.getCategories();
	}

	@Post("categories")
	@ApiOperation({ summary: "Create trainings categories" })
	async createCategories(@Body() body: CreateTrainingsCategoriesDto) {
		return await this.service.createTrainingsCategory(body);
	}
}
