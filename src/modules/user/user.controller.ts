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

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { UserLoginResendCodeDto } from "../../modules/auth/dtos/user-login.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import {
	UserChangePhoneVerifyCodeDto,
	UserCreateDto,
	UserDto,
	UserUpdateDto,
} from "./dtos/user.dto";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async readAll(@User() _user: ICurrentUser) {
		const metaData = BaseDto.createFromDto(new BaseDto<UserEntity[]>());
		metaData.data = await this.userService.readAll();
		return metaData;
	}

	@Get("/me")
	@HttpCode(HttpStatus.OK)
	async getUser(@User() user: ICurrentUser): Promise<UserDto> {
		return this.userService.getUser(user.user_id, false);
	}

	@Put("/")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	updateUser(
		@Body() updateEventsDto: UserUpdateDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.updateUser(user.user_id, updateEventsDto);
	}

	@Post("/phone")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	changePhoneUser(@Body() dto: UserCreateDto, @User() user: ICurrentUser) {
		return this.userService.changePhone(user.user_id, dto);
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

	@Post("/phone/resend-code")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	resendCodePhone(
		@Body() dto: UserLoginResendCodeDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.userResendSmsCode(user, dto);
	}
}
