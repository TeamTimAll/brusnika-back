import {
	CanActivate,
	ExecutionContext,
	Injectable,
	SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

import { RoleType } from "../constants";
import { UserRequest } from "../decorators";
import { PermissionDeniedError } from "../modules/auth/errors/PermissionDenied.error";

export const ROLES_KEY = "roles";
export const Roles = (roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<
			RoleType[] | undefined
		>(ROLES_KEY, [context.getHandler(), context.getClass()]);
		if (!requiredRoles) {
			return true;
		}
		const { user } = context.switchToHttp().getRequest<UserRequest>();
		if (!requiredRoles.some((role) => role === user.role)) {
			throw new PermissionDeniedError(`role: ${user.role}`);
		}
		return true;
	}
}
