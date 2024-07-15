import {
	CanActivate,
	ExecutionContext,
	Injectable,
	SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

import { ICurrentUser } from "interfaces/current-user.interface";

import { RoleType } from "../constants";

export const ROLES_KEY = "roles";
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);

interface IRequest extends Request {
	user: ICurrentUser;
}

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

		const { user } = context.switchToHttp().getRequest<IRequest>();
		return requiredRoles.some((role) => user.role === role);
	}
}
