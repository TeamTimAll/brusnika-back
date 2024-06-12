import { Controller, Get, Body, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/news.create.dto";
import { UpdateNewsDto } from "./dto/news.update.dto";

@Controller("news")
@ApiTags("News")
export class NewsController {
	constructor(private service: NewsService) {}

	@Get()
	async getAllNews() {
		return this.service.r_findAll();
	}

	@Post()
	async createNews(@Body() body: CreateNewsDto) {
		return this.service.create(body);
	}

	@Put()
	async updateNews(@Body() body: UpdateNewsDto) {
		return this.service.update(body.id, body);
	}
}
