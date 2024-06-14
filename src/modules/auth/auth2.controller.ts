import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { type Request } from "express";

import { ApiErrorResponse } from "../../decorators/api_error_response";
import { AgencyNotFoundError } from "../agencies/errors/AgencyNotFound.error";
import { UserCreateDto, UserFillDataDto } from "../user/dtos/user.dto";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";

import { Auth2Service } from "./auth2.service";
import {
	AgentChooseAgencyDto,
	AgentRegisterAgencyDto,
	AgentRequestAgencyDto,
	AuthResponeWithData,
	AuthResponeWithToken,
	UserLoginDto,
	UserLoginResendCodeDto,
	UserLoginVerifyCodeDto,
} from "./dtos/user-login.dto";
import { NoVerificationCodeSentError } from "./errors/NoVerificationCodeSent.error";
import { UnauthorizedError } from "./errors/Unauthorized.error";
import { UserEmailAlreadyExistsError } from "./errors/UserAlreadyExists.error";
import { VerificationCodeExpiredError } from "./errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "./errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "./errors/VerificationExists.error";
import { JwtAuthGuard } from "./guards/jwt.guard";

@ApiTags("auth2")
@Controller("auth2")
export class Auth2Controller {
	constructor(private authService: Auth2Service) {}

	@ApiOperation({ summary: "employee login" })
	@ApiOkResponse({ type: AuthResponeWithToken })
	@ApiErrorResponse(
		UnauthorizedError,
		"User not found. email: some@gmail.com",
	)
	@Post("login")
	async loginAccount(@Body() userLoginDto: UserLoginDto) {
		return this.authService.loginAccount(userLoginDto);
	}

	@ApiOperation({ summary: "verify sms code" })
	// OK responses
	@ApiOkResponse({ type: AuthResponeWithToken })
	@ApiOkResponse({ type: AuthResponeWithData })
	// Error responses
	@ApiErrorResponse(NoVerificationCodeSentError)
	@ApiErrorResponse(VerificationCodeExpiredError)
	@ApiErrorResponse(VerificationCodeIsNotCorrectError)
	//
	@Post("/agent/verify-code")
	agentLoginVerify(@Body() userLoginVerifyCodeDto: UserLoginVerifyCodeDto) {
		return this.authService.verifySmsCode(userLoginVerifyCodeDto);
	}

	@ApiOperation({ summary: "resend sms code" })
	// OK reponses
	@ApiOkResponse({ type: AuthResponeWithData })
	// Error reponses
	@ApiErrorResponse(UserNotFoundError)
	@ApiErrorResponse(NoVerificationCodeSentError)
	@ApiErrorResponse(VerificationExistsError)
	//
	@Post("/agent/resend-code")
	agentLoginResendSmsCode(@Body() dto: UserLoginResendCodeDto) {
		return this.authService.agentLoginResendSmsCode(dto);
	}

	@ApiOkResponse({ type: AuthResponeWithData })
	@ApiErrorResponse(VerificationExistsError)
	@Post("/agent")
	createAccount(@Body() dao: UserCreateDto) {
		return this.authService.agentRegister(dao);
	}

	@ApiOkResponse({ type: AuthResponeWithData })
	@ApiErrorResponse(UserEmailAlreadyExistsError)
	@Post("/agent/register/fill_data")
	agentFillDate(@Body() dao: UserFillDataDto) {
		return this.authService.agentFillData(dao);
	}

	@ApiOkResponse({ type: AuthResponeWithToken })
	@ApiErrorResponse(AgencyNotFoundError)
	@Post("/agent/register/choose_agency")
	agentChooseAgency(@Body() dao: AgentChooseAgencyDto) {
		return this.authService.agentChooseAgency(dao);
	}

	@ApiOkResponse({ type: AuthResponeWithToken })
	@Post("/agent/register/register_agency")
	agentRegisterAgency(@Body() dao: AgentRegisterAgencyDto) {
		return this.authService.agentRegisterAgency(dao);
	}

	@ApiOkResponse({ type: AuthResponeWithToken })
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
