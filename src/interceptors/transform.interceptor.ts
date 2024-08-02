import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { type Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { BaseDto } from "../common/base/base_dto";
import { ResponseStatusType } from "../common/enums/response_status_type_enum";
import { requestToMetaData } from "../filters/meta-data-request";
import { ServiceResponse } from "../types";

export interface Response<T> {
	data: T;
}

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		ctx: ExecutionContext,
		next: CallHandler,
	): Observable<BaseDto<T>> {
		const request = ctx.switchToHttp().getRequest<Request>();
		const metaData = requestToMetaData<T>(
			request,
			ResponseStatusType.SUCCESS,
		);
		return next.handle().pipe(
			map((data: T) => {
				if (data instanceof ServiceResponse) {
					metaData.setLinks(data.links);
					metaData.data = data.data as T;
				} else {
					metaData.data = data;
				}
				return metaData;
			}),
		);
	}
}
