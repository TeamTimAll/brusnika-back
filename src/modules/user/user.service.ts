import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, MoreThanOrEqual, Repository } from "typeorm";

import { AuthResponeWithTokenDto } from "modules/auth/dtos/AuthResponeWithToken.dto";

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { AgencyService } from "../agencies/agencies.service";
import { UserLoginResendCodeDto } from "../auth/dtos/UserLoginResendCode.dto";
import { NoVerificationCodeSentError } from "../auth/errors/NoVerificationCodeSent.error";
import { PermissionDeniedError } from "../auth/errors/PermissionDenied.error";
import { VerificationCodeExpiredError } from "../auth/errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "../auth/errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "../auth/errors/VerificationExists.error";
import { CityService } from "../cities/cities.service";

import { AdminLoginAsUserDto } from "./dtos/AdminLoginAsUser.dto";
import { UserChangeAgencyDto } from "./dtos/UserChangeAgency.dto";
import { UserChangeEmailDto } from "./dtos/UserChangeEmail.dto";
import { UserChangePhoneVerifyCodeDto } from "./dtos/UserChangePhoneVerifyCode.dto";
import { UserCreateDto } from "./dtos/UserCreate.dto";
import { UserFilterDto } from "./dtos/UserFilter.dto";
import { UserResponseDto } from "./dtos/UserResponse.dto";
import { UserUpdateDto } from "./dtos/UserUpdate.dto";
import { UserUpdateRoleDto } from "./dtos/UserUpdateRole.dto";
import { UserNotFoundError } from "./errors/UserNotFound.error";
import { UserPhoneNotVerifiedError } from "./errors/UserPhoneNotVerified.error";
import { UserEntity } from "./user.entity";
import { UserChangeRoleRule } from "./user.rule";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@Inject(forwardRef(() => AgencyService))
		private agencyService: AgencyService,
		private jwtService: JwtService,
		@Inject(forwardRef(() => CityService))
		private cityService: CityService,
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

	async readAll(dto: UserFilterDto, user: ICurrentUser) {
		if (user.role === RoleType.HEAD_OF_AGENCY) {
			const foundUser = await this.userRepository.findOne({
				select: { agency_id: true },
				where: { id: user.user_id },
			});
			dto.agency_id = foundUser?.agency_id;
		}
		const pageSize = (dto.page - 1) * dto.limit;
		const [users, usersCount] = await this.userRepository.findAndCount({
			select: [
				"id",
				"created_at",
				"updated_at",
				"firstName",
				"lastName",
				"role",
				"email",
				"username",
				"password",
				"phone",
				"birthDate",
				"workStartDate",
				"verification_code",
				"verification_code_sent_date",
				"email_verification_code",
				"email_verification_code_sent_date",
				"avatar",
				"register_status",
				"fullName",
				"isPhoneVerified",
				"isEmailVerified",
				"temporaryNumber",
				"temporaryEmail",
				"is_blocked",
				"city",
				"city_id",
				"agency",
				"agency_id",
			],
			relations: {
				agency: true,
				city: true,
			},
			where: {
				fullName: dto.fullname ? ILike(`%${dto.fullname}%`) : undefined,
				city_id: dto.city_id,
				role: dto.role,
				agency_id: dto.agency_id,
				created_at: dto.registered_at
					? (MoreThanOrEqual(dto.registered_at) as unknown as Date)
					: undefined,
			},
			take: dto.limit,
			skip: pageSize,
		});

		const metaData = BaseDto.create<UserEntity[]>();
		metaData.setPagination(usersCount, dto.page, dto.limit);
		metaData.data = users;
		return metaData;
	}

	async readOne(id: number) {
		const foundUser = await this.userRepository.findOne({
			select: [
				"id",
				"created_at",
				"updated_at",
				"firstName",
				"lastName",
				"role",
				"email",
				"username",
				"password",
				"phone",
				"birthDate",
				"workStartDate",
				"verification_code",
				"verification_code_sent_date",
				"email_verification_code",
				"email_verification_code_sent_date",
				"avatar",
				"register_status",
				"fullName",
				"isPhoneVerified",
				"isEmailVerified",
				"temporaryNumber",
				"temporaryEmail",
				"is_blocked",
				"city",
				"city_id",
				"agency",
				"agency_id",
			],
			relations: {
				agency: true,
				city: true,
			},
			where: {
				id: id,
			},
		});
		if (!foundUser) {
			throw new UserNotFoundError(`id: ${id}`);
		}
		return foundUser;
	}

	async changeAgency(dto: UserChangeAgencyDto, user: ICurrentUser) {
		const foundUser = await this.userRepository.findOne({
			where: {
				id: user.user_id,
			},
		});
		if (!foundUser) {
			throw new UserNotFoundError(`id: ${user.user_id}`);
		}
		await this.agencyService.readOne(dto.agency_id);
		await this.userRepository.update(foundUser.id, {
			agency_id: dto.agency_id,
		});
		foundUser.agency_id = dto.agency_id;
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

	async updateUser(dto: UserUpdateRoleDto): Promise<UserEntity> {
		const foundUser = await this.readOne(dto.id);
		if (dto.city_id) {
			await this.cityService.checkExsits(dto.city_id);
		}
		if (dto.agency_id) {
			await this.agencyService.checkExsits(dto.agency_id);
		}
		const mergedUser = this.userRepository.merge(foundUser, dto);
		return await this.userRepository.save(mergedUser);
	}

	/** Do not use this function directly. It containes permision handler for agent role user. */
	async update(id: number, dto: UserUpdateDto): Promise<UserEntity> {
		const user = await this.readOne(id);
		if (!user) {
			throw new UserNotFoundError(`id: ${id}`);
		}
		const foundRule = UserChangeRoleRule[user.role];
		if (foundRule && dto.role) {
			const canAccess = foundRule[dto.role];
			if (!canAccess) {
				new PermissionDeniedError(`role: ${user.role}`);
			}
		}
		if (user.role === RoleType.AGENT && dto.role) {
			throw new PermissionDeniedError(`role: ${user.role}`);
		}
		await this.userRepository.update(id, dto);
		return this.readOne(id);
	}

	async changePhone(
		id: number,
		dto: UserCreateDto,
	): Promise<UserResponseDto> {
		const user = await this.readOne(id);
		if (
			user.verification_code_sent_date &&
			!this.hasOneMinutePassed(user.verification_code_sent_date)
		) {
			throw new VerificationExistsError();
		}

		// const randomNumber = Math.floor(100000 + Math.random() * 900000);
		const randomNumber = 111111;

		await this.userRepository.update(user.id, {
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
	): Promise<UserResponseDto> {
		const user = await this.readOne(id);
		if (
			user.email_verification_code_sent_date &&
			!this.hasOneMinutePassed(user.email_verification_code_sent_date)
		) {
			throw new VerificationExistsError();
		}

		const randomNumber = 111111;

		await this.userRepository.update(user.id, {
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

	async verifyEmail(
		user: ICurrentUser,
		dto: UserChangePhoneVerifyCodeDto,
	): Promise<UserResponseDto> {
		const foundUser = await this.readOne(user.user_id);

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

		await this.userRepository.update(foundUser.id, {
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
	): Promise<UserResponseDto> {
		const foundUser = await this.readOne(user.user_id);

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

		await this.userRepository.update(foundUser.id, {
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
	): Promise<UserResponseDto> {
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
		await this.userRepository.update(foundUser.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
		});

		return { user_id: foundUser.id, message: "sms sent" };
	}

	async checkExists(id: number): Promise<void> {
		const user = await this.userRepository.existsBy({ id });
		if (!user) {
			throw new UserNotFoundError(`id: ${id}`);
		}
	}

	async loginAsUser(
		dto: AdminLoginAsUserDto,
	): Promise<AuthResponeWithTokenDto> {
		const foundUser = await this.readOne(dto.user_id);
		const jwtBuffer: ICurrentUser = {
			user_id: foundUser.id,
			role: foundUser.role,
		};
		return {
			accessToken: this.jwtService.sign(jwtBuffer),
		};
	}

	async delete(id: number) {
		const foundUser = await this.readOne(id);
		await this.userRepository.delete(foundUser.id);
		return foundUser;
	}
}
