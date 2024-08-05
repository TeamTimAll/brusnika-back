import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ICurrentUser } from "../../interfaces/current-user.interface";
import { AuthRespone } from "../auth/auth.service";
import { UserLoginResendCodeDto } from "../auth/dtos/UserLoginResendCode.dto";
import { NoVerificationCodeSentError } from "../auth/errors/NoVerificationCodeSent.error";
import { VerificationCodeExpiredError } from "../auth/errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "../auth/errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "../auth/errors/VerificationExists.error";

import { UserChangeEmailDto } from "./dtos/UserChangeEmail.dto";
import { UserChangePhoneVerifyCodeDto } from "./dtos/UserChangePhoneVerifyCode.dto";
import { UserCreateDto } from "./dtos/UserCreate.dto";
import { UserNotFoundError } from "./errors/UserNotFound.error";
import { UserPhoneNotVerifiedError } from "./errors/UserPhoneNotVerified.error";
import { UserEntity } from "./user.entity";

type UserResponse = Omit<AuthRespone, "register_status">;

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	get repository(): Repository<UserEntity> {
		return this.userRepository;
	}

	hasOneMinutePassed(startTime: Date): boolean {
		const oneMinute = 60 * 1000; // 60 seconds * 1000 milliseconds
		const currentTime = new Date();
		const elapsedTime = currentTime.getTime() - startTime.getTime();
		return elapsedTime >= oneMinute;
	}

	readAll() {
		return this.userRepository.find();
	}

	async readOne(id: number) {
		const foundUser = await this.userRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundUser) {
			throw new UserNotFoundError(`id: ${id}`);
		}
		return foundUser;
	}

	async findByUsernameOrEmail(
		options: Partial<{ username: string; email: string }>,
	): Promise<UserEntity | null> {
		const queryBuilder = this.userRepository.createQueryBuilder("user");

		if (options.email) {
			queryBuilder.orWhere("user.email = :email", {
				email: options.email,
			});
		}

		if (options.username) {
			queryBuilder.orWhere("user.username = :username", {
				username: options.username,
			});
		}

		return queryBuilder.getOne();
	}

	async createUser(userRegisterDto: UserCreateDto): Promise<UserEntity> {
		const user: UserEntity = this.userRepository.create(userRegisterDto);
		const savedUser: UserEntity = await this.userRepository.save(user);

		return savedUser;
	}

	async getUser(userId: number, full = true): Promise<UserEntity> {
		// const queryBuilder = await this.userRepository.createQueryBuilder('user');

		// await queryBuilder.where('user.id = :userId', { userId });
		if (full) {
			const user = await this.userRepository.findOne({
				where: {
					id: userId,
				},
				relations: ["city", "agency"],
			});

			if (!user) {
				throw new UserNotFoundError(
					`User not found. user_id: ${userId}`,
				);
			}

			return user;
		} else {
			const user = await this.userRepository.findOne({
				where: {
					id: userId,
				},
				relations: ["city", "agency"],
				select: [
					"id",
					"fullName",
					"firstName",
					"lastName",
					"birthDate",
					"email",
					"phone",
					"city",
					"agency",
					"avatar",
					"role",
				],
			});

			if (!user) {
				throw new UserNotFoundError(
					`User not found. user_id: ${userId}`,
				);
			}

			return user;
		}
		// const user2Entity = await queryBuilder.getOne();
	}

	async update(
		id: number,
		updateEventsDto: Partial<UserEntity>,
	): Promise<unknown> {
		const user = await this.readOne(id);

		if (!user) {
			throw new UserNotFoundError();
		}

		await this.userRepository.update(id, updateEventsDto);

		return this.readOne(id);
	}

	async changePhone(id: number, dto: UserCreateDto): Promise<UserResponse> {
		const user = await this.readOne(id);
		if (
			user.verification_code_sent_date &&
			!this.hasOneMinutePassed(user.verification_code_sent_date)
		) {
			throw new VerificationExistsError();
		}

		// const randomNumber = Math.floor(100000 + Math.random() * 900000);
		const randomNumber = 111111;

		await this.update(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
			temporaryNumber: dto.phone,
		});

		// todo send sms

		return {
			user_id: user.id,
			message: "sms sent",
		};
	}

	async changeEmail(
		id: number,
		dto: UserChangeEmailDto,
	): Promise<UserResponse> {
		const user = await this.readOne(id);
		if (
			user.email_verification_code_sent_date &&
			!this.hasOneMinutePassed(user.email_verification_code_sent_date)
		) {
			throw new VerificationExistsError();
		}

		const randomNumber = 111111;

		await this.update(user.id, {
			email_verification_code: randomNumber,
			email_verification_code_sent_date: new Date(),
			temporaryEmail: dto.email,
		});

		// todo send sms

		return {
			user_id: user.id,
			message: "sms sent",
		};
	}

	async verifyEmail(user: ICurrentUser, dto: UserChangePhoneVerifyCodeDto) {
		const foundUser = await this.getUser(user.user_id);

		if (!foundUser.isEmailVerified) {
			throw new UserPhoneNotVerifiedError();
		}
		if (!foundUser.email_verification_code_sent_date) {
			throw new NoVerificationCodeSentError();
		}
		if (
			this.hasOneMinutePassed(foundUser.email_verification_code_sent_date)
		) {
			throw new VerificationCodeExpiredError();
		}
		if (foundUser.email_verification_code !== dto.code) {
			throw new VerificationCodeIsNotCorrectError();
		}

		await this.update(foundUser.id, {
			email: foundUser.temporaryEmail,
			temporaryEmail: null,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			isEmailVerified: true,
		});
		return {
			user_id: foundUser.id,
			message: "Verification code is correct",
		};
	}

	async verifySmsCode(
		user: ICurrentUser,
		dto: UserChangePhoneVerifyCodeDto,
	): Promise<UserResponse> {
		const foundUser = await this.getUser(user.user_id);

		if (!foundUser.isPhoneVerified) {
			throw new UserPhoneNotVerifiedError();
		}
		if (!foundUser.verification_code_sent_date) {
			throw new NoVerificationCodeSentError();
		}
		if (this.hasOneMinutePassed(foundUser.verification_code_sent_date)) {
			throw new VerificationCodeExpiredError();
		}
		if (foundUser.verification_code !== dto.code) {
			throw new VerificationCodeIsNotCorrectError();
		}

		await this.update(foundUser.id, {
			phone: foundUser.temporaryNumber,
			temporaryNumber: null,
			verification_code: null,
			verification_code_sent_date: null,
			isPhoneVerified: true,
		});
		return {
			user_id: foundUser.id,
			message: "Verification code is correct",
		};
	}

	async userResendSmsCode(
		user: ICurrentUser,
		dto: UserLoginResendCodeDto,
	): Promise<UserResponse> {
		const foundUser = await this.userRepository.findOne({
			where: {
				id: user.user_id,
				temporaryNumber: dto.phone,
			},
		});

		if (!foundUser) {
			throw new UserNotFoundError(`phone number: ${dto.phone}`);
		}
		if (!foundUser.verification_code_sent_date) {
			throw new NoVerificationCodeSentError();
		}
		if (!this.hasOneMinutePassed(foundUser.verification_code_sent_date)) {
			throw new VerificationExistsError();
		}
		// const randomNumber = Math.floor(100000 + Math.random() * 900000);
		const randomNumber = 111111;

		// todo send sms
		await this.update(foundUser.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		return { user_id: foundUser.id, message: "sms sent" };
	}
}
