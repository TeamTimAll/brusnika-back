import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDefined,
	IsObject,
	IsOptional,
	ValidateNested,
} from "class-validator";

import { PromptLabel } from "lib/prompt/prompt";

import { SearchData } from "../../modules/search/search.service";
import { ResponseStatusType } from "../enums/response_status_type_enum";
import { LeadState } from "../../modules//leads/leads.entity";

import { BaseEntity } from "./base.entity";
import { BaseError } from "./baseError";

export interface Pagination {
	module_name?: SearchData["module_name"];
	count: number;
	page: number;
	limit: number;
}

export class Dto {
	desc!: string;
}

export class MetaPrompt {
	id!: number;
	labels!: PromptLabel;
	meta!: object;
}

export interface MetaLink {
	totalPage: number;
	currPage: number;
	limit: number;
	total: number;
}

export interface MetaLinkWithModule extends MetaLink {
	module_name?: SearchData["module_name"];
}

export interface MetaLinkWithLeadState extends MetaLink {
	state?: LeadState;
}

export class MetaDto<T = object> {
	@IsOptional()
	type: ResponseStatusType = ResponseStatusType.SUCCESS;

	@IsOptional()
	links!: MetaLink | (MetaLinkWithModule | MetaLinkWithLeadState)[];

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

	links!: MetaLink;
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

	setLink(link: MetaLink) {
		this.meta.links = link;
		return this;
	}

	setLinks(links: (MetaLinkWithModule | MetaLinkWithLeadState)[]) {
		this.meta.links = links;
		return this;
	}

	setResponseType(status: ResponseStatusType) {
		this.meta.type = status;
		return this;
	}

	setPagination(count: number, page: number, limit: number): void {
		const maxPage = Math.ceil(count / limit);
		this.setLink({
			currPage: page,
			totalPage: maxPage,
			limit: limit,
			total: count,
		});
	}

	getPagination(): MetaLink {
		return this.meta.links as MetaLink;
	}

	getPaginations(): MetaLinkWithModule {
		return this.meta.links as MetaLinkWithModule;
	}

	setPaginations(paginations: Pagination[]): void {
		const links: MetaLinkWithModule[] = [];
		paginations.forEach((p) => {
			const maxPage = Math.ceil(p.count / p.limit);
			links.push({
				module_name: p.module_name,
				currPage: p.page,
				totalPage: maxPage,
				limit: p.limit,
				total: p.count,
			});
		});
		this.setLinks(links);
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

	static create<T = BaseEntity[], D = unknown>(data?: D) {
		return this.createFromDto(new BaseDto<T>(), data);
	}
}
