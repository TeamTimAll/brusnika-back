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
import { UnauthorizedError } from "../errors/Unauthorized.error";
import { UserService } from "../../../modules/user/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		@Inject()
		private userService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
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
			if (payload.user_id) {
				const user = await this.userService.repository.findOne({
					select: { id: true },
					where: {
						id: payload.user_id,
					},
				});
				if (!user) {
					throw new UnauthorizedError();
				}
			}
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request["user"] = payload;
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
