import {
	CanActivate,
	ExecutionContext,
	Injectable,
	SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "../constants";
import { Observable } from "rxjs";

export const ROLES_KEY = "roles";
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
			Roles,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();
		return requiredRoles.some((role) => user.roles?.includes(role));
	}
}
