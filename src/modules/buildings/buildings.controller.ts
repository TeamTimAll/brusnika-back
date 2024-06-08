import {
	Body,
	Controller,
	Get,
	Post,
	Param,
	Put,
	Delete,
	Query,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateBuilding } from "../buildings/dtos/building.create.dto";
import { UpdateBuilding } from "../buildings/dtos/building.update.dto";
import { Uuid } from "boilerplate.polyfill";
import { BuildingsService } from "./buildings.service";

@Controller("buildings")
@ApiTags("Buildings")
export class BuildingsController {
	constructor(private premiseService: BuildingsService) {}

	@Get()
	@ApiQuery({ name: "project_id", required: false })
	async getAllPremises(@Query("project_id") project_id: Uuid) {
		if (project_id) {
			return this.premiseService.r_findAll({
				where: { project_id },
				relations: ["project"],
			});
		}
		return this.premiseService.r_findAll({
			relations: ["project"],
		});
	}

	@Post()
	async createNewPremise(@Body() body: CreateBuilding) {
		return this.premiseService.create(body);
	}

	@Put(":id")
	async updatePremise(@Body() body: UpdateBuilding, @Param("id") id: Uuid) {
		return this.premiseService.update(id, body);
	}

	@Delete(":id")
	async deletePremise(@Param("id") id: Uuid) {
		return this.premiseService.remove(id);
	}
}
