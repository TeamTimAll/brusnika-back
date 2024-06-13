import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type Request } from "express";

import { ConfigManager } from "../../../config";
import { UnauthorizedError } from "../errors/Unauthorized.error";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedError();
		}
		try {
			const payload = await this.jwtService.verifyAsync<object>(token, {
				secret: ConfigManager.config.JWT_PRIVATE_KEY,
			});
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
