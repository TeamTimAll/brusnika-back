import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Put,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiAcceptedResponse, ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { RoleType } from "../../constants";
import { User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { UserLoginResendCodeMetaDataDto } from "../auth/dtos/UserLoginResendCode.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { UserDto } from "./dtos/User.dto";
import { UserChangeEmailMetaDataDto } from "./dtos/UserChangeEmail.dto";
import { UserChangePhoneVerifyCodeMetaDataDto } from "./dtos/UserChangePhoneVerifyCode.dto";
import { UserCreateMetaDataDto } from "./dtos/UserCreate.dto";
import { UserUpdateMetaDataDto } from "./dtos/UserUpdate.dto";
import { UserService } from "./user.service";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async readAll(@User() _user: ICurrentUser) {
		return await this.userService.readAll();
	}

	@Get("/me")
	@HttpCode(HttpStatus.OK)
	async getUser(@User() user: ICurrentUser): Promise<UserDto> {
		return this.userService.getUser(user.user_id, false);
	}

	@Put("/")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	updateUser(@Body() dto: UserUpdateMetaDataDto, @User() user: ICurrentUser) {
		return this.userService.update(user.user_id, dto.data);
	}

	@Post("/phone")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	changePhoneUser(
		@Body() dto: UserCreateMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.changePhone(user.user_id, dto.data);
	}

	@Post("/phone/verify")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	verifyPhone(
		@Body() dto: UserChangePhoneVerifyCodeMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.verifySmsCode(user, dto.data);
	}

	@Post("/email")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	changeEmail(
		@Body() dto: UserChangeEmailMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.changeEmail(user.user_id, dto.data);
	}

	@Post("/email/verify")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	verifyEmail(
		@Body() dto: UserChangePhoneVerifyCodeMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.verifyEmail(user, dto.data);
	}

	@Post("/phone/resend-code")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	resendCodePhone(
		@Body() dto: UserLoginResendCodeMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.userResendSmsCode(user, dto.data);
	}
}
