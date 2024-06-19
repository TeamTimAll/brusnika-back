import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ICurrentUser } from "../../interfaces/current-user.interface";
import { AgenciesEntity } from "../agencies/agencies.entity";
import { AgenciesService } from "../agencies/agencies.service";
import { AgencyNotFoundError } from "../agencies/errors/AgencyNotFound.error";
import { UserCreateDto, UserFillDataDto } from "../user/dtos/user.dto";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";
import { UserRegisterStatus } from "../user/user.entity";
import { UserService } from "../user/user.service";

import {
	AgentChooseAgencyDto,
	AgentRegisterAgencyDto,
	AgentRequestAgencyDto,
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

export type AuthRespone =
	| { user_id: string; message: string; register_status: string }
	| { accessToken: string };

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private agenciesService: AgenciesService,
	) {}

	async agentRegister(body: UserCreateDto): Promise<AuthRespone> {
		let user = await this.userService.findOne({
			phone: body.phone,
		});

		if (!user) {
			user = await this.userService.createUser(body);
		}

		if (
			user.verification_code_sent_date &&
			!this.hasOneMinutePassed(user.verification_code_sent_date)
		) {
			throw new VerificationExistsError();
		}

		const randomNumber = 111111;

		await this.userService.updateUser(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		return {
			user_id: user.id,
			message: "sms sent",
			register_status: user.register_status,
		};
	}

	async agentFillData(body: UserFillDataDto): Promise<AuthRespone> {
		const user = await this.userService.getUser(body.id);

		const foundUser = await this.userService.findOne({
			email: body.email,
		});

		if (foundUser) {
			throw new UserEmailAlreadyExistsError(`email: ${body.email}`);
		}

		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus.ATTACHMENT,
			...body,
		});

		return {
			user_id: user.id,
			message: "ok",
			register_status: UserRegisterStatus.ATTACHMENT,
		};
	}

	async agentChooseAgency(body: AgentChooseAgencyDto): Promise<AuthRespone> {
		const user = await this.userService.getUser(body.user_id);

		const agency = await this.agenciesService.findOne(body.agency_id);
		if (!agency?.data) {
			throw new AgencyNotFoundError();
		}
		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus.FINISHED,
			agency_id: body.agency_id,
			workStartDate: body.startWorkDate,
		});

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async agentRegisterAgency(
		body: AgentRegisterAgencyDto,
	): Promise<AuthRespone> {
		const user = await this.userService.getUser(body.user_id);

		const newAgency = await this.agenciesService.create<AgenciesEntity>({
			city_id: body.city_id,
			email: body.email,
			inn: body.email,
			legalName: body.legalName,
			phone: body.phone,
			title: body.title,
		});
		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus.FINISHED,
			agency_id: newAgency.data[0].id,
		});

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async agentRequestAgency(
		body: AgentRequestAgencyDto,
	): Promise<AuthRespone> {
		const user = await this.userService.getUser(body.user_id);

		const newAgency = await this.agenciesService.create<AgenciesEntity>({
			city_id: body.city_id,
			ownerFullName: body.ownerFullName,
			ownerPhone: body.ownerPhone,
			title: body.title,
		});
		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus.FINISHED,
			agency_id: newAgency.data[0].id,
		});

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async loginAccount(loginDto: UserLoginDto): Promise<AuthRespone> {
		// TODO: remove this
		const emails = ["plingen@vicegolf.com", "kacper.polak@teacode.io"];
		const user = await this.userService.findOne({
			email: loginDto.email,
			password: loginDto.password,
		});

		if (!user || !emails.includes(user.email ?? "")) {
			throw new UnauthorizedError(
				`User not found. email: ${loginDto.email}`,
			);
		}

		const { password, ...result } = user;
		const jwtBuffer: ICurrentUser = {
			user_id: result.id,
			role: result.role,
		};
		return {
			accessToken: this.jwtService.sign(jwtBuffer),
		};
	}

	async verifySmsCode(dto: UserLoginVerifyCodeDto): Promise<AuthRespone> {
		const user = await this.userService.getUser(dto.user_id);

		if (!user.verification_code_sent_date) {
			throw new NoVerificationCodeSentError();
		}
		if (this.hasOneMinutePassed(user.verification_code_sent_date)) {
			throw new VerificationCodeExpiredError();
		}
		if (user.verification_code !== dto.code) {
			throw new VerificationCodeIsNotCorrectError();
		}

		// If agent registration is finished, an access token needs to be sent.
		if (
			user.isPhoneVerified &&
			user.register_status === UserRegisterStatus.FINISHED
		) {
			return {
				accessToken: this.jwtService.sign({
					user_id: user.id,
					role: user.role,
				}),
			};
		}

		// If a new agent is created, he needs to be sent to the data filling section.
		// Otherwise, send him to his current step.
		if (user.register_status === UserRegisterStatus.CREATED) {
			await this.userService.updateUser(user.id, {
				isPhoneVerified: true,
				register_status: UserRegisterStatus.FILL_DATA,
			});
		}
		return {
			user_id: user.id,
			message: "verified",
			register_status: user.register_status,
		};
	}

	async agentLoginResendSmsCode(
		dto: UserLoginResendCodeDto,
	): Promise<AuthRespone> {
		const user = await this.userService.findOne({
			phone: dto.phone,
		});

		if (!user) {
			throw new UserNotFoundError(`phone: ${dto.phone}`);
		}
		if (!user.verification_code_sent_date) {
			throw new NoVerificationCodeSentError();
		}
		if (!this.hasOneMinutePassed(user.verification_code_sent_date)) {
			throw new VerificationExistsError();
		}

		const randomNumber = 111111;

		await this.userService.updateUser(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		return {
			user_id: user.id,
			message: "sms sent",
			register_status: user.register_status,
		};
	}

	async getUser(email: string) {
		const user = await this.userService.findByUsernameOrEmail({
			email,
		});
		if (!user) {
			return new UserNotFoundError(`email: ${email}`);
		}
		return user;
	}

	getCity() {
		// todo return city
	}

	private hasOneMinutePassed(startTime: Date): boolean {
		const oneMinute = 60 * 1000; // 60 seconds * 1000 milliseconds
		const currentTime = new Date();
		const elapsedTime = currentTime.getTime() - startTime.getTime();
		return elapsedTime >= oneMinute;
	}
}
