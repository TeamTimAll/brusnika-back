import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { RoleType } from "../../constants";
import { ApiDtoResponse, User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { UserLoginResendCodeMetaDataDto } from "../auth/dtos/UserLoginResendCode.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { UserMetaDataDto } from "./dtos/User.dto";
import { UserChangeEmailMetaDataDto } from "./dtos/UserChangeEmail.dto";
import { UserChangePhoneVerifyCodeMetaDataDto } from "./dtos/UserChangePhoneVerifyCode.dto";
import { UserCreateMetaDataDto } from "./dtos/UserCreate.dto";
import { UserFilterDto } from "./dtos/UserFilter.dto";
import { UserReadAllMetaDataDto } from "./dtos/UserReadAll.dto";
import { UserResponseMetaDataDto } from "./dtos/UserResponse.dto";
import { UserUpdateMetaDataDto } from "./dtos/UserUpdate.dto";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserUpdateRoleMetaDataDto } from "./dtos/UserUpdateRole.dto";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	@ApiOperation({
		description: `### User list'ini olish.
		\n Ruxsat etilgan foydalanuvchilar rollari:
		\n - *${RoleType.ADMIN}*
		\n - *${RoleType.AFFILIATE_MANAGER}*
		\n - *${RoleType.HEAD_OF_AGENCY}*`,
	})
	@ApiDtoResponse(UserReadAllMetaDataDto, HttpStatus.OK)
	@Roles([
		RoleType.ADMIN,
		RoleType.AFFILIATE_MANAGER,
		RoleType.HEAD_OF_AGENCY,
	])
	async readAll(@Query() dto: UserFilterDto, @User() user: ICurrentUser) {
		return await this.userService.readAll(dto, user);
	}

	@Get("/me")
	@ApiOperation({ description: "### User o'z ma'lumotlarini olish." })
	@ApiDtoResponse(UserReadAllMetaDataDto, HttpStatus.OK)
	async getUser(@User() user: ICurrentUser): Promise<UserEntity> {
		return this.userService.readOne(user.user_id);
	}

	@Put("/")
	@ApiOperation({ description: "### User o'z ma'lumotlarini o'zgartirish." })
	@ApiDtoResponse(UserMetaDataDto, HttpStatus.OK)
	update(@Body() dto: UserUpdateMetaDataDto, @User() user: ICurrentUser) {
		return this.userService.update(user.user_id, dto.data);
	}

	@Roles([RoleType.HEAD_OF_AGENCY, RoleType.AFFILIATE_MANAGER])
	@Post("/update")
	@ApiOperation({ description: "### User ma'lumotlarini o'zgartirish." })
	@ApiDtoResponse(UserMetaDataDto, HttpStatus.OK)
	updateUser(
		@Body() dto: UserUpdateRoleMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.updateUser(dto.data, user);
	}

	@Post("/phone")
	@ApiOperation({
		description: "### User o'z telefon raqamini o'zgartirish.",
	})
	@ApiDtoResponse(UserResponseMetaDataDto, HttpStatus.OK)
	changePhoneUser(
		@Body() dto: UserCreateMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.changePhone(user.user_id, dto.data);
	}

	@Post("/phone/verify")
	@ApiOperation({ description: "### User o'z telefon raqamini tasdiqlash." })
	@ApiDtoResponse(UserResponseMetaDataDto, HttpStatus.OK)
	verifyPhone(
		@Body() dto: UserChangePhoneVerifyCodeMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.verifySmsCode(user, dto.data);
	}

	@Post("/email")
	@ApiOperation({ description: "### User o'z emailini o'zgartirish." })
	@ApiDtoResponse(UserResponseMetaDataDto, HttpStatus.OK)
	changeEmail(
		@Body() dto: UserChangeEmailMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.changeEmail(user.user_id, dto.data);
	}

	@Post("/email/verify")
	@ApiOperation({ description: "### User o'z emailini tasdiqlash." })
	@ApiDtoResponse(UserResponseMetaDataDto, HttpStatus.OK)
	verifyEmail(
		@Body() dto: UserChangePhoneVerifyCodeMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.verifyEmail(user, dto.data);
	}

	@Post("/phone/resend-code")
	@ApiOperation({
		description:
			"### User telefon raqami uchun sms code'ni qayta yuborishi.",
	})
	@ApiDtoResponse(UserResponseMetaDataDto, HttpStatus.OK)
	resendCodePhone(
		@Body() dto: UserLoginResendCodeMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return this.userService.userResendSmsCode(user, dto.data);
	}

	@Get(":id")
	@ApiOperation({
		description: `### User'ni id bilan olish.
		\n id - user id'si
		\n Ruxsat etilgan foydalanuvchilar rollari:
		\n - *${RoleType.ADMIN}*
		\n - *${RoleType.AFFILIATE_MANAGER}*
		\n - *${RoleType.HEAD_OF_AGENCY}*`,
	})
	@ApiDtoResponse(UserReadAllMetaDataDto, HttpStatus.OK)
	@Roles([
		RoleType.ADMIN,
		RoleType.AFFILIATE_MANAGER,
		RoleType.HEAD_OF_AGENCY,
	])
	async readOne(@Param("id") id: number, @User() _user: ICurrentUser) {
		return await this.userService.readOne(id);
	}
}
