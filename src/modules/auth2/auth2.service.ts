import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AgenciesEntity } from "../agencies/agencies.entity";
import { AgenciesService } from "../agencies/agencies.service";
import { AgencyNotFoundError } from "../agencies/errors/AgencyNotFound.error";
import { UserFillDataDto } from "../user/dtos/user.dto";
import { UserCreateDto } from "../user2/dtos/user.dto";
import { UserNotFoundError } from "../user2/errors/UserNotFound.error";
import { UserRegisterStatus2 } from "../user2/user2.entity";
import { User2Service } from "../user2/user2.service";

import {
	AgentChooseAgencyDto,
	AgentLoginDto,
	AgentRegisterAgencyDto,
	AgentRequestAgencyDto,
	UserLoginDto,
	UserLoginResendCodeDto,
	UserLoginVerifyCodeDto,
} from "./dtos/user-login2.dto";
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

@Injectable()
export class Auth2Service {
	private userStatusDt = new UserStatusDecisionTable();
	constructor(
		private jwtService: JwtService,
		private userService: User2Service,
		private agenciesService: AgenciesService,
	) {
		// Setting event for check user status
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus2.FINISHED,
			to_status: UserRegisterStatus2.CREATED,
			onErrorEvent() {
				throw new EventFinishedToCreatedError(
					`${UserRegisterStatus2.FINISHED} -> ${UserRegisterStatus2.CREATED}`,
				);
			},
		});
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus2.FINISHED,
			to_status: UserRegisterStatus2.FILLED,
			onErrorEvent() {
				throw new EventFinishedToFillDataError(
					`${UserRegisterStatus2.FINISHED} -> ${UserRegisterStatus2.FILLED}`,
				);
			},
		});
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus2.CREATED,
			to_status: UserRegisterStatus2.FINISHED,
			onErrorEvent() {
				throw new EventFinishedToFillDataError(
					`${UserRegisterStatus2.CREATED} -> ${UserRegisterStatus2.FINISHED}`,
				);
			},
		});
		this.userStatusDt.setEvent({
			from_status: UserRegisterStatus2.FILLED,
			to_status: UserRegisterStatus2.CREATED,
			onErrorEvent() {
				throw new EventFinishedToFillDataError(
					`${UserRegisterStatus2.FILLED} -> ${UserRegisterStatus2.CREATED}`,
				);
			},
		});
	}

	async createUser(body: UserCreateDto) {
		let user = await this.userService.findOne({
			phone: body.phone,
		});

		if (user) {
			if (
				user?.isPhoneVerified &&
				user.register_status !== UserRegisterStatus2.CREATED
			) {
				this.userStatusDt.setEvent({
					from_status: UserRegisterStatus2.FINISHED,
					to_status: UserRegisterStatus2.FINISHED,
					event() {
						throw new UserAlreadyExistsError();
					},
				});
				this.userStatusDt.statusSwitcher(
					UserRegisterStatus2.FINISHED,
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

		return { user_id: user.id, message: "sms sent" };
	}

	async agentFillData(body: UserFillDataDto) {
		const user = await this.userService.getUser(body.id);

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus2.CREATED,
			user.register_status,
		);

		const foundUser = await this.userService.findOne({
			email: body.email,
		});

		if (foundUser) {
			throw new UserEmailAlreadyExistsError(`email: ${body.email}`);
		}

		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus2.FILLED,
			...body,
		});

		return {
			message: "ok",
		};
	}

	async agentChooseAgency(body: AgentChooseAgencyDto) {
		const user = await this.userService.getUser(body.userId);

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus2.FILLED,
			user.register_status,
		);

		const agency = await this.agenciesService.findOne(body.agency_id);
		if (!agency?.data) {
			throw new AgencyNotFoundError();
		}
		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus2.FINISHED,
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

	async agentRegisterAgency(body: AgentRegisterAgencyDto) {
		const user = await this.userService.getUser(body.userId);

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus2.FILLED,
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
			register_status: UserRegisterStatus2.FINISHED,
			agency_id: newAgency.data[0].id,
		});

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async agentRequestAgency(body: AgentRequestAgencyDto) {
		const user = await this.userService.getUser(body.userId);

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus2.FILLED,
			user.register_status,
		);

		const newAgency = await this.agenciesService.create<AgenciesEntity>({
			city_id: body.city_id,
			ownerFullName: body.ownerFullName,
			ownerPhone: body.ownerPhone,
			title: body.title,
		});
		await this.userService.updateUser(user.id, {
			register_status: UserRegisterStatus2.FINISHED,
			agency_id: newAgency.data[0].id,
		});

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async loginAccount(loginDto: UserLoginDto) {
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

	async agentLogin(dto: AgentLoginDto) {
		const user = await this.userService.findOne({
			phone: dto.phone,
		});

		if (!user) {
			throw new UserNotFoundError(`User not found. phone: ${dto.phone}`);
		}

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus2.FINISHED,
			user.register_status,
		);

		const randomNumber = 111111;

		await this.userService.updateUser(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		return { user_id: user.id, message: "sms sent" };
	}

	async verifySmsCode(dto: UserLoginVerifyCodeDto) {
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
			user.register_status === UserRegisterStatus2.FINISHED
		) {
			return {
				accessToken: this.jwtService.sign({
					user_id: user.id,
					role: user.role,
				}),
			};
		}

		this.userStatusDt.statusSwitcher(
			UserRegisterStatus2.CREATED,
			user.register_status,
		);
		await this.userService.updateUser(user.id, {
			isPhoneVerified: true,
		});
		return {
			user_id: user.id,
			message: "verified",
		};
	}

	async agentLoginResendSmsCode(dto: UserLoginResendCodeDto) {
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

		return { user_id: user.id, message: "sms sent" };
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
