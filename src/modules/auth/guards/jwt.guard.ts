import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigManager } from "../../../config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}
  
	async canActivate(context: ExecutionContext): Promise<boolean> {
	  const request = context.switchToHttp().getRequest();
	  const token = this.extractTokenFromHeader(request);
	  
	  if (!token) {
		throw new UnauthorizedException();
	  }
	  try {
		const payload = await this.jwtService.verifyAsync(
		  token,
		  {
			secret: ConfigManager.config.JWT_PRIVATE_KEY,
		  }
		);
		// 💡 We're assigning the payload to the request object here
		// so that we can access it in our route handlers
		request['user'] = payload;
	  } catch (error) {
		console.log(error, 'error');
		throw new UnauthorizedException();
	  }
	  return true;
	}
  
	private extractTokenFromHeader(request: Request): string | undefined {
	  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
	  return type === 'Bearer' ? token : undefined;
	}
}
