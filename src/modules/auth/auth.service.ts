import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { AgencyService } from "../agencies/agencies.service";
import { CityService } from "../cities/cities.service";
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
import { UserPasswordIsNotCorrectError } from "./errors/UserPasswordIsNotCorrect.error";
import { VerificationCodeExpiredError } from "./errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "./errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "./errors/VerificationExists.error";

export type AuthRespone =
	| { user_id: number; message: string; register_status: string }
	| { accessToken: string };

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private agenciesService: AgencyService,
		private cityService: CityService,
	) {}

	async agentRegister(body: UserCreateDto): Promise<AuthRespone> {
		let user = await this.userService.repository.findOneBy({
			phone: body.phone,
		});

		if (!user) {
			user = await this.userService.createUser({
				...body,
				role: RoleType.AGENT,
			});
		}

		if (
			user.verification_code_sent_date &&
			!this.hasOneMinutePassed(user.verification_code_sent_date)
		) {
			throw new VerificationExistsError();
		}

		const randomNumber = 111111;

		await this.userService.update(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		return {
			user_id: user.id,
			message: "sms sent",
			register_status: user.register_status,
		};
	}

	async agentFillData(dto: UserFillDataDto): Promise<AuthRespone> {
		const user = await this.userService.getUser(dto.id);

		const foundUser = await this.userService.repository.findOneBy({
			email: dto.email,
		});

		if (foundUser) {
			throw new UserEmailAlreadyExistsError(`email: ${dto.email}`);
		}

		await this.cityService.readOne(dto.city_id);

		await this.userService.update(user.id, {
			register_status: UserRegisterStatus.ATTACHMENT,
			...dto,
		});

		return {
			user_id: user.id,
			message: "ok",
			register_status: UserRegisterStatus.ATTACHMENT,
		};
	}

	async agentChooseAgency(body: AgentChooseAgencyDto): Promise<AuthRespone> {
		const user = await this.userService.getUser(body.user_id);
		await this.agenciesService.readOne(body.agency_id);
		await this.userService.update(user.id, {
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

		const newAgency = await this.agenciesService.create(
			{
				city_id: body.city_id,
				email: body.email,
				inn: body.email,
				legalName: body.legalName,
				phone: body.phone,
				title: body.title,
			},
			{ user_id: user.id, role: user.role },
		);
		await this.userService.update(user.id, {
			register_status: UserRegisterStatus.FINISHED,
			agency_id: newAgency.id,
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

		const newAgency = await this.agenciesService.create(
			{
				city_id: body.city_id,
				ownerFullName: body.ownerFullName,
				ownerPhone: body.ownerPhone,
				title: body.title,
			},
			{ user_id: user.id, role: user.role },
		);
		await this.userService.update(user.id, {
			register_status: UserRegisterStatus.FINISHED,
			agency_id: newAgency.id,
		});

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async loginAccount(loginDto: UserLoginDto): Promise<AuthRespone> {
		const user = await this.userService.repository.findOneBy({
			email: loginDto.email,
			role: RoleType.EMPLOYEE,
		});

		if (!user) {
			throw new UnauthorizedError(
				`User not found. email: ${loginDto.email}`,
			);
		}

		if (user.password !== loginDto.password) {
			throw new UserPasswordIsNotCorrectError(`Email: ${loginDto.email}`);
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
			await this.userService.update(user.id, {
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
		const user = await this.userService.repository.findOneBy({
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

		await this.userService.update(user.id, {
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
