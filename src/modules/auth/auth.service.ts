import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AgenciesEntity } from "../agencies/agencies.entity";
import { AgenciesService } from "../agencies/agencies.service";
import { AgencyNotFoundError } from "../agencies/errors/AgencyNotFound.error";
import { UserCreateDto, UserFillDataDto } from "../user/dtos/user.dto";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";
import { UserRegisterStatus } from "../user/user.entity";
import { UserService } from "../user/user.service";

import {
	AgentChooseAgencyDto,
	AgentLoginDto,
	AgentRegisterAgencyDto,
	AgentRequestAgencyDto,
	UserLoginDto,
	UserLoginResendCodeDto,
	UserLoginVerifyCodeDto,
} from "./dtos/user-login.dto";
import { NoVerificationCodeSentError } from "./errors/NoVerificationCodeSent.error";
import { UnauthorizedError } from "./errors/Unauthorized.error";
import {
	UserAlreadyExistsError,
	UserEmailAlreadyExistsError,
} from "./errors/UserAlreadyExists.error";
import { VerificationCodeExpiredError } from "./errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "./errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "./errors/VerificationExists.error";
import {
	EventFinishedToCreatedError,
	EventFinishedToFillDataError,
} from "./errors/event.error";
import { UserStatusDecisionTable } from "./user_status.dt";

type AuthRespone =
	| { user_id: string; message: string; register_status: string }
	| { accessToken: string };

@Injectable()
export class AuthService {
	private userStatusDt = new UserStatusDecisionTable();
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private agenciesService: AgenciesService,
	) {
		// Setting event for check user status
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus.FINISHED,
			to_status: UserRegisterStatus.CREATED,
			onErrorEvent() {
				throw new EventFinishedToCreatedError(
					`${UserRegisterStatus.FINISHED} -> ${UserRegisterStatus.CREATED}`,
				);
			},
		});
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus.FINISHED,
			to_status: UserRegisterStatus.FILLED,
			onErrorEvent() {
				throw new EventFinishedToFillDataError(
					`${UserRegisterStatus.FINISHED} -> ${UserRegisterStatus.FILLED}`,
				);
			},
		});
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus.CREATED,
			to_status: UserRegisterStatus.FINISHED,
			onErrorEvent() {
				throw new EventFinishedToFillDataError(
					`${UserRegisterStatus.CREATED} -> ${UserRegisterStatus.FINISHED}`,
				);
			},
		});
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus.FILLED,
			to_status: UserRegisterStatus.CREATED,
			onErrorEvent() {
				throw new EventFinishedToFillDataError(
					`${UserRegisterStatus.FILLED} -> ${UserRegisterStatus.CREATED}`,
				);
			},
		});
	}

	async createUser(body: UserCreateDto): Promise<AuthRespone> {
		let user = await this.userService.findOne({
			phone: body.phone,
		});

		if (user) {
			if (
				user?.isPhoneVerified &&
				user.register_status !== UserRegisterStatus.CREATED
			) {
				this.userStatusDt.setEvent({
					from_status: UserRegisterStatus.FINISHED,
					to_status: UserRegisterStatus.FINISHED,
					event() {
						throw new UserAlreadyExistsError();
					},
				});
				this.userStatusDt.statusSwitcher(
					UserRegisterStatus.FINISHED,
					user.register_status,
				);
			}
		} else {
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

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus.CREATED,
			user.register_status,
		);

		const foundUser = await this.userService.findOne({
			email: body.email,
		});

		if (foundUser) {
			throw new UserEmailAlreadyExistsError(`email: ${body.email}`);
		}

		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus.FILLED,
			...body,
		});

		return {
			user_id: user.id,
			message: "ok",
			register_status: user.register_status,
		};
	}

	async agentChooseAgency(body: AgentChooseAgencyDto): Promise<AuthRespone> {
		const user = await this.userService.getUser(body.user_id);

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus.FILLED,
			user.register_status,
		);

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

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus.FILLED,
			user.register_status,
		);

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

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus.FILLED,
			user.register_status,
		);

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
		const user = await this.userService.findOne({
			email: loginDto.email,
		});

		if (!user) {
			throw new UnauthorizedError(
				`User not found. email: ${loginDto.email}`,
			);
		}

		const { password, ...result } = user;
		return {
			accessToken: this.jwtService.sign(result),
		};
	}

	async agentLogin(dto: AgentLoginDto): Promise<AuthRespone> {
		const user = await this.userService.findOne({
			phone: dto.phone,
		});

		if (!user) {
			throw new UserNotFoundError(`User not found. phone: ${dto.phone}`);
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

		if (user.register_status === UserRegisterStatus.DRAFT) {
			this.userStatusDt.statusSwitcher(
				UserRegisterStatus.CREATED,
				user.register_status,
			);
			await this.userService.updateUser(user.id, {
				isPhoneVerified: true,
			});
			return {
				user_id: user.id,
				message: "verified",
				register_status: user.register_status,
			};
		}
		throw new EventFinishedToFillDataError(
			`${UserRegisterStatus.FINISHED} -> ${user.register_status}`,
		);
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
