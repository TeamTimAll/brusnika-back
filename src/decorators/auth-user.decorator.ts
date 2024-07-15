import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { ICurrentUser } from "interfaces/current-user.interface";

interface UserRequest extends Request {
	user: ICurrentUser;
}

export const User = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<UserRequest>();
		return request.user;
	},
);
