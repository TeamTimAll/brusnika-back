import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiErrorResponse } from "../../decorators/api_error_response";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { AgencyNotFoundError } from "../agencies/errors/AgencyNotFound.error";
import { UserCreateMetaDataDto } from "../user/dtos/UserCreate.dto";
import { UserFillDataMetaDataDto } from "../user/dtos/UserFillData.dto";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";

import { AuthService } from "./auth.service";
import { AgentChooseAgencyMetaDataDto } from "./dtos/AgentChooseAgency.dto";
import { AgentRegisterAgencyMetaDataDto } from "./dtos/AgentRegisterAgency.dto";
import { AgentRequestAgencyMetaDataDto } from "./dtos/AgentRequestAgency.dto";
import {
	AuthResponeWithData,
	AuthResponeWithToken,
} from "./dtos/AuthResponeWithToken.dto";
import { UserLoginMetaDataDto } from "./dtos/UserLogin.dto";
import { UserLoginResendCodeMetaDataDto } from "./dtos/UserLoginResendCode.dto";
import { UserLoginVerifyCodeMetaDataDto } from "./dtos/UserLoginVerifyCode.dto";
import { NoVerificationCodeSentError } from "./errors/NoVerificationCodeSent.error";
import { UnauthorizedError } from "./errors/Unauthorized.error";
import { UserEmailAlreadyExistsError } from "./errors/UserAlreadyExists.error";
import { VerificationCodeExpiredError } from "./errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "./errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "./errors/VerificationExists.error";

@ApiTags("auth")
@Controller("auth")
@UseInterceptors(TransformInterceptor)
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: "employee login" })
	@ApiOkResponse({ type: AuthResponeWithToken })
	@ApiErrorResponse(
		UnauthorizedError,
		"User not found. email: some@gmail.com",
	)
	@Post("login")
	async loginAccount(@Body() dto: UserLoginMetaDataDto) {
		return this.authService.loginAccount(dto.data);
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
	agentLoginVerify(@Body() dto: UserLoginVerifyCodeMetaDataDto) {
		return this.authService.verifySmsCode(dto.data);
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
	agentLoginResendSmsCode(@Body() dto: UserLoginResendCodeMetaDataDto) {
		return this.authService.agentLoginResendSmsCode(dto.data);
	}

	@ApiOkResponse({ type: AuthResponeWithData })
	@ApiErrorResponse(VerificationExistsError)
	@Post("/agent")
	createAccount(@Body() dto: UserCreateMetaDataDto) {
		return this.authService.agentRegister(dto.data);
	}

	@ApiOkResponse({ type: AuthResponeWithData })
	@ApiErrorResponse(UserEmailAlreadyExistsError)
	@Post("/agent/register/fill_data")
	agentFillDate(@Body() dto: UserFillDataMetaDataDto) {
		return this.authService.agentFillData(dto.data);
	}

	@ApiOkResponse({ type: AuthResponeWithToken })
	@ApiErrorResponse(AgencyNotFoundError)
	@Post("/agent/register/choose_agency")
	agentChooseAgency(@Body() dto: AgentChooseAgencyMetaDataDto) {
		return this.authService.agentChooseAgency(dto.data);
	}

	@ApiOkResponse({ type: AuthResponeWithToken })
	@Post("/agent/register/register_agency")
	agentRegisterAgency(@Body() dto: AgentRegisterAgencyMetaDataDto) {
		return this.authService.agentRegisterAgency(dto.data);
	}

	@ApiOkResponse({ type: AuthResponeWithToken })
	@Post("/agent/register/request_agency")
	agentRequestAgency(@Body() dto: AgentRequestAgencyMetaDataDto) {
		return this.authService.agentRequestAgency(dto.data);
	}
}
