import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import {
	UserCreateDto,
	UserFillDataDto,
} from "../../modules/user/dtos/user.dto";

import { AuthService } from "./auth.service";
import {
	AgentChooseAgencyDto,
	AgentLoginDto,
	AgentRegisterAgencyDto,
	AgentRequestAgencyDto,
	LoginSuccess,
	UserLoginDto,
	UserLoginResendCodeDto,
	UserLoginVerifyCodeDto,
} from "./dtos/user-login.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: "employee login" })
	@ApiResponse({
		status: HttpStatus.OK,
		type: LoginSuccess,
	})
	@Post("login")
	async userLogin(@Body() userLoginDto: UserLoginDto) {
		return this.authService.loginAccount(userLoginDto);
	}

	@ApiOperation({ summary: "agent login" })
	@ApiResponse({
		status: HttpStatus.OK,
		type: LoginSuccess,
	})
	@Post("/login/agent")
	async agentLogin(@Body() agentLoginDto: AgentLoginDto) {
		return this.authService.agentLogin(agentLoginDto);
	}

	@ApiOperation({ summary: "agent login verify" })
	@ApiResponse({
		status: HttpStatus.OK,
		type: LoginSuccess,
	})
	@Post("/login/agent/verify")
	async agentLoginVerify(
		@Body() userLoginVerifyCodeDto: UserLoginVerifyCodeDto,
	) {
		return this.authService.verifySmsCode(userLoginVerifyCodeDto);
	}

	@ApiOperation({ summary: "agent login resend" })
	@ApiResponse({
		status: HttpStatus.OK,
		type: LoginSuccess,
	})
	@Post("/login/agent/resend")
	async agentLoginResendSmsCode(@Body() dto: UserLoginResendCodeDto) {
		return this.authService.agentLoginResendSmsCode(dto);
	}

	@Post("/agent/register")
	createAccount(@Body() dao: UserCreateDto) {
		return this.authService.createUser(dao);
	}

	@Post("/agent/register/fill_data")
	agentFillDate(@Body() dao: UserFillDataDto) {
		return this.authService.agentFillData(dao);
	}

	@Post("/agent/register/choose_agency")
	agentChooseAgency(@Body() dao: AgentChooseAgencyDto) {
		return this.authService.agentChooseAgency(dao);
	}

	@Post("/agent/register/register_agency")
	agentRegisterAgency(@Body() dao: AgentRegisterAgencyDto) {
		return this.authService.agentRegisterAgency(dao);
	}

	@Post("/agent/register/request_agency")
	agentRequestAgency(@Body() dao: AgentRequestAgencyDto) {
		return this.authService.agentRequestAgency(dao);
	}

	@Get("/city")
	getCity() {
		return this.authService.getCity();
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	status(@Req() req: Request) {
		return req.user;
	}
}
