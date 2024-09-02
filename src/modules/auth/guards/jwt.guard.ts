import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type Request } from "express";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ConfigManager } from "../../../config";
import { UserRequest } from "../../../decorators";
import { UserService } from "../../../modules/user/user.service";
import { UnauthorizedError } from "../errors/Unauthorized.error";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		@Inject()
		private userService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserRequest>();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedError();
		}
		try {
			const payload = await this.jwtService.verifyAsync<ICurrentUser>(
				token,
				{
					secret: ConfigManager.config.JWT_PRIVATE_KEY,
				},
			);
			if (!payload.user_id) {
				throw new UnauthorizedError();
			}
			const user = await this.userService.repository.findOne({
				select: {
					id: true,
					role: true,
					email: true,
					username: true,
					firebase_token: true,
				},
				where: {
					id: payload.user_id,
				},
			});
			if (!user) {
				throw new UnauthorizedError();
			}

			request.user = {
				user_id: user.id,
				role: user.role,
				email: user.email,
				username: user.username,
				firebase_token: user.firebase_token,
			};
		} catch (error) {
			throw new UnauthorizedError();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] =
			request.headers["authorization"]?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}
}
