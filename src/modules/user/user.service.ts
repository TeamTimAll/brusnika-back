import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { AgencyEntity } from "../agencies/agencies.entity";
import { AgencyService } from "../agencies/agencies.service";
import { AuthResponeWithTokenDto } from "../auth/dtos/AuthResponeWithToken.dto";
import { UserLoginResendCodeDto } from "../auth/dtos/UserLoginResendCode.dto";
import { NoVerificationCodeSentError } from "../auth/errors/NoVerificationCodeSent.error";
import { PermissionDeniedError } from "../auth/errors/PermissionDenied.error";
import { VerificationCodeExpiredError } from "../auth/errors/VerificationCodeExpired.error";
import { VerificationCodeIsNotCorrectError } from "../auth/errors/VerificationCodeIsNotCorrect.error";
import { VerificationExistsError } from "../auth/errors/VerificationExists.error";
import { BookingRepository } from "../bookings/booking.repository";
import { IUserCreation } from "../bookings/bookings.service";
import { CityEntity } from "../cities/cities.entity";
import { CityService } from "../cities/cities.service";
import { SettingsNotFoundError } from "../settings/errors/SettingsNotFound.error";
import { SettingsRepository } from "../settings/settings.repository";

import { AdminLoginAsUserDto } from "./dtos/AdminLoginAsUser.dto";
import { UserChangeAgencyDto } from "./dtos/UserChangeAgency.dto";
import { UserChangeEmailDto } from "./dtos/UserChangeEmail.dto";
import { UserChangePhoneVerifyCodeDto } from "./dtos/UserChangePhoneVerifyCode.dto";
import { UserCreateDto } from "./dtos/UserCreate.dto";
import { UserFilterDto, UserSortBy } from "./dtos/UserFilter.dto";
import { UserResponseDto } from "./dtos/UserResponse.dto";
import { UserUpdateDto } from "./dtos/UserUpdate.dto";
import { UserUpdateRoleDto } from "./dtos/UserUpdateRole.dto";
import { UserVerifyDto } from "./dtos/UserVerify.dto";
import { UserAlreadyExistsError } from "./errors/UserExists.error";
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
		@Inject()
		private bookingRepository: BookingRepository,
		@Inject()
		private readonly settingsRepository: SettingsRepository,
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
		let userQuery = this.userRepository
			.createQueryBuilder("u")
			.leftJoinAndMapOne(
				"u.agency",
				AgencyEntity,
				"a",
				"a.id = u.agency_id",
			)
			.leftJoinAndMapOne("u.city", CityEntity, "c", "c.id = u.city_id")
			.select([
				"u.id",
				"u.created_at",
				"u.updated_at",
				"u.fullName",
				"u.firstName",
				"u.lastName",
				"u.role",
				"u.email",
				"u.username",
				"u.password",
				"u.phone",
				"u.birthDate",
				"u.workStartDate",
				"u.avatar",
				"u.is_phone_verified",
				"u.is_email_verified",
				"u.temporary_role",
				"u.is_verified",
				"u.status",
				"c.id",
				"c.name",
				"u.city_id",
				"a.id",
				"a.legalName",
				"u.agency_id",
			])
			.limit(dto.limit)
			.offset(pageSize);
		if (dto.city_id) {
			userQuery = userQuery.where("u.city_id = :city_id", {
				city_id: dto.city_id,
			});
		}
		if (dto.role) {
			userQuery = userQuery.andWhere("u.role = :role", {
				role: dto.role,
			});
		}
		if (dto.agency_id) {
			userQuery = userQuery.andWhere("u.agency_id = :agency_id", {
				agency_id: dto.agency_id,
			});
		}
		if (dto.registered_at) {
			userQuery = userQuery.andWhere("u.created_at <= :created_at", {
				created_at: dto.registered_at,
			});
		}
		if (dto.text) {
			userQuery = userQuery.andWhere(
				new Brackets((qb) => {
					qb.where("CONCAT(u.first_name, ' ', u.last_name) ILIKE :fullname", {
						fullname: `%${dto.text}%`,
					})
						.orWhere("u.phone ILIKE :phone", { phone: `%${dto.text}%` })
						.orWhere("a.legalName ILIKE :legalName", {
							legalName: `%${dto.text}%`,
						});
				}),
			);
		}
		if (dto.sort_by === UserSortBy.FULLNAME) {
			userQuery = userQuery.orderBy("u.fullName", dto.order_by);
		}
		if (dto.sort_by === UserSortBy.ROLE) {
			userQuery = userQuery.orderBy("u.role", dto.order_by);
		}
		if (dto.sort_by === UserSortBy.STATUS) {
			userQuery = userQuery.orderBy("u.status", dto.order_by);
		}
		if (dto.sort_by === UserSortBy.REGISTERED_AT) {
			userQuery = userQuery.orderBy("u.created_at", dto.order_by);
		}
		if (dto.sort_by === UserSortBy.AGENCY_NAME) {
			userQuery = userQuery.orderBy("a.name", dto.order_by);
		}
		if (dto.sort_by === UserSortBy.CITY_NAME) {
			userQuery = userQuery.orderBy("c.name", dto.order_by);
		}
		const [users, usersCount] = await userQuery.getManyAndCount();

		let agency_id: number | undefined;
		if (user.role === RoleType.HEAD_OF_AGENCY) {
			const currentUser = await this.userRepository.findOne({
				select: { agency_id: true },
				where: { id: user.user_id },
			});
			agency_id = currentUser?.agency_id;
		}

		const newUserCount = await this.userRepository.count({
			where: {
				role: RoleType.NEW_MEMBER,
				agency_id: agency_id,
			},
		});
		const totalUserCount = await this.userRepository.count({
			where: {
				agency_id: agency_id,
			},
		});

		const metaData = BaseDto.create<UserEntity[]>();
		metaData.setPagination(usersCount, dto.page, dto.limit);
		metaData.data = users;
		metaData.meta.data = {
			new_user_count: newUserCount,
			total_user_count: totalUserCount,
		};
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
				"is_phone_verified",
				"is_email_verified",
				"temporary_number",
				"temporary_email",
				"temporary_role",
				"is_verified",
				"status",
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

	async me(user_id: number) {
		const foundUser = await this.readOne(user_id);
		const userCreatedCount = await this.bookingRepository.count({
			where: {
				create_by_id: user_id,
			},
		});
		const settings = await this.settingsRepository.readOne();
		if (!settings) {
			throw new SettingsNotFoundError();
		}
		const metaData = BaseDto.create<UserEntity>();
		metaData.data = foundUser;
		metaData.meta.data = {
			user_created_count: userCreatedCount,
			max_user_creation_limit: settings.booking_limit,
			remaining_user_creation_limit:
				settings.booking_limit - userCreatedCount,
		} as IUserCreation;
		return metaData;
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
		await this.userRepository.update(id, dto);
		return this.readOne(id);
	}

	async changePhone(
		id: number,
		dto: UserCreateDto,
	): Promise<UserResponseDto> {
		const user = await this.readOne(id);
		const doesUserExist = await this.userRepository.existsBy({
			phone: dto.phone,
		});
		if (doesUserExist) {
			throw new UserAlreadyExistsError(`phone: ${dto.phone}`);
		}
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
			temporary_number: dto.phone,
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
		const doesUserExist = await this.userRepository.existsBy({
			email: dto.email,
		});
		if (doesUserExist) {
			throw new UserAlreadyExistsError(`email: ${dto.email}`);
		}
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
			temporary_email: dto.email,
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

		if (!foundUser.is_email_verified) {
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
			email: foundUser.temporary_email,
			temporary_email: null,
			email_verification_code: null,
			email_verification_code_sent_date: null,
			is_email_verified: true,
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

		if (!foundUser.is_phone_verified) {
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
			phone: foundUser.temporary_number,
			temporary_number: null,
			verification_code: null,
			verification_code_sent_date: null,
			is_phone_verified: true,
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
				temporary_number: dto.phone,
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

	async checkExists(id: number) {
		const user = await this.userRepository.findOne({ where: { id } });

		if (!user) {
			throw new UserNotFoundError(`id: ${id}`);
		}

		return user;
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

	async verifyUser(dto: UserVerifyDto) {
		const foundUser = await this.readOne(dto.user_id);
		let userRole: RoleType = foundUser.role;
		if (dto.is_verified) {
			if (foundUser.temporary_role) {
				userRole = foundUser.temporary_role;
			}
		}
		await this.userRepository.update(foundUser.id, {
			role: userRole,
			is_verified: dto.is_verified,
		});
		foundUser.is_verified = dto.is_verified;
		foundUser.role = userRole;
		return foundUser;
	}
}
