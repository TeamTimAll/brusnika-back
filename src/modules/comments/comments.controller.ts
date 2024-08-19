import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { RoleType } from "../../constants";
import { ApiDtoResponse, ApiErrorResponse } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CommentsService } from "./comments.service";
import {
	CommentArrayMetaDataDto,
	CommentMetaDataDto,
} from "./dtos/Comment.dto";
import { CreateCommentMetaDataDto } from "./dtos/CreateComment.dto";
import { UpdateCommentMetaDataDto } from "./dtos/UpdateComment.dto";
import { CommentNotFoundError } from "./errors/CommentNotFound.error";

@ApiTags("Comments")
@Controller("comments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class CommentsController {
	constructor(private commentsService: CommentsService) {}

	@Get()
	@ApiDtoResponse(CommentArrayMetaDataDto, HttpStatus.OK)
	async getAll() {
		return this.commentsService.readAll();
	}

	@Roles([RoleType.ADMIN])
	@Post()
	@ApiDtoResponse(CommentMetaDataDto, HttpStatus.OK)
	async create(@Body() dto: CreateCommentMetaDataDto) {
		return this.commentsService.create(dto.data);
	}

	@Roles([RoleType.ADMIN])
	@Put(":id")
	@ApiDtoResponse(CommentMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(CommentNotFoundError, "id: 'id'")
	async update(
		@Param("id") id: number,
		@Body() dto: UpdateCommentMetaDataDto,
	) {
		return this.commentsService.update(id, dto.data);
	}

	@Roles([RoleType.ADMIN])
	@Delete(":id")
	@ApiDtoResponse(CommentMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(CommentNotFoundError, "id: 'id'")
	async delete(@Param("id") id: number) {
		return this.commentsService.delete(id);
	}
}
