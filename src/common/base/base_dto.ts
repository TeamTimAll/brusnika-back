import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDefined,
	IsObject,
	IsOptional,
	ValidateNested
} from "class-validator";

import { ResponseStatusType } from "../enums/response_status_type_enum";

import { BaseError } from "./baseError";

export class MetaPrompt {
	id!: number;
	labels!: string[];
	meta!: object;
}

export class MetaDto<T = object> {
	@IsOptional()
	type: ResponseStatusType = ResponseStatusType.SUCCESS;

	@IsOptional()
	taskId!: string;

	// @ApiProperty()
	@IsOptional()
	@IsObject()
	params!: T;

	prompt!: MetaPrompt;
}

export class BaseDto<T = unknown> {
	@ApiProperty({ type: MetaDto })
	@IsDefined()
	// @IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => MetaDto)
	meta!: MetaDto;

	@ApiProperty()
	@IsDefined()
	@IsArray()
	data!: T;

	/**
	 * Setting the prompt and error type "ERROR".
	 */
	setPrompt(error: BaseError) {
		this.meta.type = ResponseStatusType.ERROR;
		this.meta.prompt = error;
		return this;
	}

	setResponseType(status: ResponseStatusType) {
		this.meta.type = status;
		return this;
	}

	static createFromDto<T extends BaseDto, D>(dto: T, data?: D): T {
		// Filling meta if it is null or undefined
		dto.meta ??= new MetaDto();
		dto.meta.type ??= ResponseStatusType.SUCCESS;
		// TODO: auto generate taskID if it is null or undefined
		dto.meta.taskId = "";
		dto.meta.params ??= {};

		// Filling prompt if it is null or undefined
		dto.meta.prompt ??= new MetaPrompt();
		dto.meta.prompt.id ??= 0;
		dto.meta.prompt.labels ??= [];
		dto.meta.prompt.meta ??= {};

		// Filling data if it is null or undefined
		dto.data ??= data;

		return dto;
	}
}
