import { log } from "console";

import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiAcceptedResponse, ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { RoleType } from "../../constants";
import { Roles, User } from "../../decorators";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import {
	UserChangePhoneVerifyCodeDto,
	UserCreateDto,
	UserDto,
	UserUpdateDto,
} from "./dtos/user.dto";
import { UserService } from "./user.service";
// import { RolesGuard } from "../../guards/roles.guard";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles([RoleType.ADMIN, RoleType.USER])
	async getUser(@User() user: ICurrentUser): Promise<UserDto> {
		log("user", user);
		return this.userService.getUser(user.id, false);
	}

	@Put("/")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	updateUser(
		@Body() updateEventsDto: UserUpdateDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.updateUser(user.id, updateEventsDto);
	}

	@Post("/phone")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	changePhoneUser(@Body() dto: UserCreateDto, @User() user: ICurrentUser) {
		return this.userService.changePhone(user.id, dto);
	}

	@Post("/phone/verify")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	verifyPhone(
		@Body() dto: UserChangePhoneVerifyCodeDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.verifySmsCode(user, dto);
	}
}
