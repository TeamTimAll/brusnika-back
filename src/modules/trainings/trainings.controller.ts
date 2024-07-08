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

import { TrainingsService } from "./trainings.service";
import { CreateTrainingsDto } from "./dto/trainings.create.dto";
import { UpdateTrainingsDto } from "./dto/trainings.update.dto";
import { TrainingsEntity } from "./trainings.entity";
import { LikeTrainingsDto } from "./dto/trainings.dto";
import { CreateTrainingsCategoriesDto } from "./modules/categories/dto/categories.dto";

@Controller("trainings")
@ApiTags("Trainings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TrainingsController {
	constructor(private service: TrainingsService) {}

	@Get()
	@ApiOperation({ summary: "Get all trainings" })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			example: BaseDto.createFromDto(new BaseDto(), [
				TrainingsEntity.toDto({}),
			]),
		},
	})
	async getAllTrainings() {
		return this.service.r_findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get trainings by id" })
	async getTrainingsById(@Query("id") id: number, @User() user: ICurrentUser) {
		return this.service.r_findOne(id, user);
	}

	@Post()
	@ApiOperation({ summary: "create trainings" })
	async createTrainings(@Body() body: CreateTrainingsDto, @User() user: ICurrentUser) {
		return this.service.createTrainings(body, user);
	}

	@Post("like")
	@ApiOperation({ summary: "like trainings" })
	async likeTrainings(@Body() body: LikeTrainingsDto, @User() user: ICurrentUser) {
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
