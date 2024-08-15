import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDefined,
	IsObject,
	IsOptional,
	ValidateNested,
} from "class-validator";

import { PromptLabel } from "lib/prompt/prompt";

import { ResponseStatusType } from "../enums/response_status_type_enum";

import { BaseEntity } from "./base.entity";
import { BaseError } from "./baseError";

export class Dto {
	desc!: string;
}

export class MetaPrompt {
	id!: number;
	labels!: PromptLabel;
	meta!: object;
}

export class MetaLinks {
	totalPage!: number;
	currPage!: number;
	limit!: number;
	total!: number;
}

export class MetaDto<T = object> {
	@IsOptional()
	type: ResponseStatusType = ResponseStatusType.SUCCESS;

	@IsOptional()
	links!: MetaLinks;

	@IsOptional()
	taskId!: string;

	// @ApiProperty()
	@IsOptional()
	@IsObject()
	params!: T;

	data?: object;
	prompt!: MetaPrompt;
}

export class MetaResponseDto<T = object> implements MetaDto<T> {
	@ApiProperty({ enum: ResponseStatusType })
	type: ResponseStatusType = ResponseStatusType.SUCCESS;

	@ApiProperty()
	params!: T;

	links!: MetaLinks;
	taskId!: string;
	data?: object;
	prompt!: MetaPrompt;
}

export class BaseDto<T = unknown> {
	@ApiProperty({ required: false })
	@IsOptional()
	@ValidateNested()
	@Type(() => MetaDto)
	meta!: MetaDto;

	@ApiProperty()
	@IsDefined()
	data!: T;

	/**
	 * Setting the prompt and error type "ERROR".
	 */
	setPrompt(error: BaseError) {
		this.meta.type = ResponseStatusType.ERROR;
		this.meta.prompt = error;
		return this;
	}

	setLinks(links: MetaLinks) {
		this.meta.links = links;
		return this;
	}

	setResponseType(status: ResponseStatusType) {
		this.meta.type = status;
		return this;
	}

	setPagination(count: number, page: number, limit: number): void {
		const maxPage = Math.ceil(count / limit);
		this.setLinks({
			currPage: page,
			totalPage: maxPage,
			limit: limit,
			total: count,
		});
	}

	static createFromDto<T extends BaseDto, D>(dto: T, data?: D): T {
		// Filling meta if it is null or undefined
		dto.meta ??= new MetaDto();
		dto.meta.type ??= ResponseStatusType.SUCCESS;
		// TODO: auto generate taskID if it is null or undefined
		// dto.meta.taskId = "";
		dto.meta.params ??= {};

		// Filling prompt if it is null or undefined
		// dto.meta.prompt ??= new MetaPrompt();
		// dto.meta.prompt.id ??= 0;
		// dto.meta.prompt.labels ??= { ru: "", uz: "", en: "" };
		// dto.meta.prompt.meta ??= {};

		// Filling data if it is null or undefined
		dto.data = data ? data : null;

		return dto;
	}

	static create<T extends BaseEntity | BaseEntity[], D = unknown>(data?: D) {
		return this.createFromDto(new BaseDto<T>(), data);
	}
}
