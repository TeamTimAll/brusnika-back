import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";

import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { AgencyService } from "../agencies/agencies.service";
import { CityService } from "../cities/cities.service";
import { UserCreateDto } from "../user/dtos/UserCreate.dto";
import { UserFillDataDto } from "../user/dtos/UserFillData.dto";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";
import { UserRegisterStatus, UserStatus } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.entity";
import { UserQueueService } from "../queues/user/user.service";

import { AgentChooseAgencyDto } from "./dtos/AgentChooseAgency.dto";
import { AgentRegisterAgencyDto } from "./dtos/AgentRegisterAgency.dto";
import { AgentRequestAgencyDto } from "./dtos/AgentRequestAgency.dto";
import {
	AuthResponeWithData,
	AuthResponeWithTokenDto,
} from "./dtos/AuthResponeWithToken.dto";
import { UserLoginDto } from "./dtos/UserLogin.dto";
import { UserLoginResendCodeDto } from "./dtos/UserLoginResendCode.dto";
import { UserLoginVerifyCodeDto } from "./dtos/UserLoginVerifyCode.dto";
import { NoVerificationCodeSentError } from "./errors/NoVerificationCodeSent.error";
import { UserEmailAlreadyExistsError } from "./errors/UserAlreadyExists.error";
import { UserBlockedError } from "./errors/UserBlocked.error";
import { UserPasswordIsNotCorrectError } from "./errors/UserPasswordIsNotCorrect.error";
import { UserPasswordOrEmailNotCorrectError } from "./errors/UserPasswordOrEmailNotCorrect.error";
import { VerificationCodeExpiredError } from "./errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "./errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "./errors/VerificationExists.error";
import { SmsService } from "./sms.service";
import { KeycloakDto } from "./dtos/keycloack.dto";
import { IDecodedPayload } from "./types";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private agenciesService: AgencyService,
		private cityService: CityService,
		private smsService: SmsService,
		private notificationService: NotificationService,
		private userQueueService: UserQueueService,
	) {}

	async agentRegister(body: UserCreateDto): Promise<AuthResponeWithData> {
		let user = await this.userService.repository.findOneBy({
			phone: body.phone,
		});
		if (!user) {
			user = await this.userService.createUser({
				...body,
				role: RoleType.NEW_MEMBER,
			});
		}
		if (user.status === UserStatus.BLOCKED) {
			throw new UserBlockedError(`id: ${user.id}`);
		}
		if (
			user.verification_code_sent_date &&
			!this.hasOneMinutePassed(user.verification_code_sent_date)
		) {
			throw new VerificationExistsError();
		}

		const randomNumber = 111111;
		// const randomNumber = randomOtp();

		await this.userService.repository.update(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		// eslint-disable-next-line no-constant-condition
		if (user.phone && false) {
			await this.smsService.sendMessage(randomNumber, "user.phone");
		}

		return {
			user_id: user.id,
			message: "sms sent",
			register_status: user.register_status,
		};
	}

	async agentFillData(dto: UserFillDataDto): Promise<AuthResponeWithData> {
		const user = await this.userService.readOneWithRelation(dto.id);

		const foundUser = await this.userService.repository.findOneBy({
			email: dto.email,
		});

		if (foundUser) {
			throw new UserEmailAlreadyExistsError(`email: ${dto.email}`);
		}

		await this.cityService.readOne(dto.city_id);

		await this.userService.repository.update(user.id, {
			register_status: UserRegisterStatus.ATTACHMENT,
			...dto,
		});

		return {
			user_id: user.id,
			message: "ok",
			register_status: UserRegisterStatus.ATTACHMENT,
		};
	}

	async keycloak(dto: KeycloakDto) {
		const url =
			"https://login.brusnika.ru/realms/Staging/protocol/openid-connect/token";
		const data = new URLSearchParams({
			grant_type: "authorization_code",
			client_id: "aquamarine",
			code: dto.code,
			redirect_uri: dto.redirectUri,
			client_secret: "ML48XVCU1lv362574ZTyonqXoHQgrJJh",
		});
		console.log(
			dto,
			"-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-",
		);

		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};

		try {
			const response = await axios.post(url, data.toString(), {
				headers,
			});

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const token: string = response?.data?.access_token;

			const [, payload] = token.split(".");

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const decodedPayload: IDecodedPayload = JSON.parse(
				Buffer.from(payload, "base64").toString("utf-8"),
			);

			const foundUser = await this.userService.readOneByKeycloakIdOrEmail(
				decodedPayload.sub,
				decodedPayload.email,
			);

			if (foundUser) {
				return {
					accessToken: this.jwtService.sign({
						user_id: foundUser.id,
						role: foundUser.role,
					}),
				};
			}

			const newUser = this.userService.repository.create({
				email: decodedPayload.email,
				firstName: decodedPayload.given_name,
				lastName: decodedPayload.family_name,
				keycloak_id: decodedPayload.sub,
				role: RoleType.AFFILIATE_MANAGER,
				is_verified: true,
				city_id: 1,
			});

			const savedUser = await this.userService.repository.save(newUser);

			return {
				accessToken: this.jwtService.sign({
					user_id: savedUser.id,
					role: savedUser.role,
				}),
			};
		} catch (error: any) {
			console.log(error);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			throw new BadRequestException(error.code);
		}
	}

	async agentChooseAgency(
		body: AgentChooseAgencyDto,
	): Promise<AuthResponeWithTokenDto> {
		const user = await this.userService.readOneWithRelation(body.user_id);
		await this.agenciesService.readOne(body.agency_id);
		await this.userService.repository.update(user.id, {
			register_status: UserRegisterStatus.FINISHED,
			agency_id: body.agency_id,
			workStartDate: body.startWorkDate,
		});

		const users = await this.userService.repository.find({
			where: { agency_id: body.agency_id, role: RoleType.HEAD_OF_AGENCY },
			select: { id: true, firebase_token: true },
		});

		await this.userQueueService.makeRequest(
			await this.userQueueService.createFormEntity({
				...user,
				agency_id: body.agency_id,
			}),
		);

		await this.notificationService.sendToUsers(users, {
			type: NotificationType.AGENT_REQUEST_FOR_AGENCY,
			object_id: user.id,
			title: "К вашему агентству прикрепился новый агент.",
			description: user.fullName,
		});

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async agentRegisterAgency(
		dto: AgentRegisterAgencyDto,
	): Promise<AuthResponeWithTokenDto> {
		const user = await this.userService.readOneWithRelation(dto.user_id);
		let temporary_role = RoleType.AGENT;
		if (dto.isOwner) {
			temporary_role = RoleType.HEAD_OF_AGENCY;
		}
		const newAgency = await this.agenciesService.create(
			{
				city_id: dto.city_id,
				email: dto.email,
				inn: dto.email,
				legalName: dto.legalName,
				phone: dto.phone,
				title: dto.title,
				authority_signatory_doc: dto.authority_signatory_doc,
				company_card_doc: dto.company_card_doc,
				entry_doc: dto.entry_doc,
				ownerFullName: dto.ownerFullName,
				ownerPhone: dto.ownerPhone,
				tax_registration_doc: dto.tax_registration_doc,
			},
			{ user_id: user.id, role: user.role },
		);
		await this.userService.repository.update(user.id, {
			register_status: UserRegisterStatus.FINISHED,
			temporary_role: temporary_role,
			agency_id: newAgency.id,
		});

		await this.userQueueService.makeRequest(
			await this.userQueueService.createFormEntity({
				...user,
				agency_id: newAgency.id,
			}),
		);

		return {
			accessToken: this.jwtService.sign({
				user_id: user.id,
				role: user.role,
			}),
		};
	}

	async agentRequestAgency(
		body: AgentRequestAgencyDto,
	): Promise<AuthResponeWithTokenDto> {
		const user = await this.userService.readOneWithRelation(body.user_id);

		const newAgency = await this.agenciesService.create(
			{
				city_id: body.city_id,
				ownerFullName: body.ownerFullName,
				ownerPhone: body.ownerPhone,
				title: body.title,
			},
			{ user_id: user.id, role: user.role },
		);
		await this.userService.repository.update(user.id, {
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

	async loginAccount(
		loginDto: UserLoginDto,
	): Promise<AuthResponeWithTokenDto> {
		const user = await this.userService.repository.findOneBy({
			email: loginDto.email,
			password: loginDto.password,
		});

		if (!user) {
			throw new UserPasswordOrEmailNotCorrectError(
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

	async verifySmsCode(
		dto: UserLoginVerifyCodeDto,
	): Promise<AuthResponeWithData | AuthResponeWithTokenDto> {
		const user = await this.userService.readOneWithRelation(dto.user_id);

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
			user.is_phone_verified &&
			user.register_status === UserRegisterStatus.FINISHED
		) {
			await this.userService.repository.update(user.id, {
				verification_code_sent_date: null,
			});
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
			await this.userService.repository.update(user.id, {
				is_phone_verified: true,
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
	): Promise<AuthResponeWithData> {
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
		// const randomNumber = randomOtp();

		await this.userService.repository.update(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		// eslint-disable-next-line no-constant-condition
		if (user.phone && false) {
			await this.smsService.sendMessage(randomNumber, "user.phone");
		}

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
