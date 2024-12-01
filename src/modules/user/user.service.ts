import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Brackets, FindOptionsSelect, Repository } from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

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
import { UserFilterByDateEnum } from "../analytics/types/user-by-date.type";
import { UserQueueService } from "../queues/user/user.service";

import { NewUserFilterDto, UserSearchDto, UserUpdateTokenDto } from "./dtos";
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
import { UserActivityEntity } from "./entities/user-activity.entity";
import { UserAlreadyExistsError } from "./errors/UserExists.error";
import { UserNotFoundError } from "./errors/UserNotFound.error";
import { UserPhoneNotVerifiedError } from "./errors/UserPhoneNotVerified.error";
import { IUserDailyStatistics, IUserStatisticsByCity } from "./types";
import { UserEntity } from "./user.entity";
import { UserChangeRoleRule } from "./user.rule";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(UserActivityEntity)
		private userActivityRepository: Repository<UserActivityEntity>,
		@Inject(forwardRef(() => AgencyService))
		private agencyService: AgencyService,
		@Inject(forwardRef(() => UserQueueService))
		private userQueueService: UserQueueService,
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
			]);

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
			userQuery = userQuery.andWhere("u.created_at >= :created_at", {
				created_at: dto.registered_at,
			});
		}
		if (dto.text) {
			userQuery = userQuery.andWhere(
				new Brackets((qb) => {
					qb.where(
						"CONCAT(u.first_name, ' ', u.last_name) ILIKE :fullname",
						{
							fullname: `%${dto.text}%`,
						},
					)
						.orWhere("u.phone ILIKE :phone", {
							phone: `%${dto.text}%`,
						})
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
			userQuery = userQuery.orderBy("a.legalName", dto.order_by);
		}
		if (dto.sort_by === UserSortBy.CITY_NAME) {
			userQuery = userQuery.orderBy("c.name", dto.order_by);
		}

		if (user.role === RoleType.MANAGER) {
			userQuery = userQuery.andWhere(
				"u.role != :admin and u.role != :manager",
				{
					admin: RoleType.ADMIN,
					manager: RoleType.MANAGER,
				},
			);
		}

		if (dto.is_new) {
			userQuery = userQuery.andWhere("u.role = :new_member", {
				new_member: RoleType.NEW_MEMBER,
			});
		}

		if (!dto.is_verified) {
			userQuery = userQuery.andWhere("u.is_verified is FALSE");
		}

		userQuery = userQuery.limit(dto.limit).offset(pageSize);

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

	async newUsers(dto: NewUserFilterDto, user: ICurrentUser) {
		let agency_id: number | undefined;

		if (user.role === RoleType.HEAD_OF_AGENCY) {
			const foundUser = await this.userRepository.findOne({
				select: { agency_id: true },
				where: { id: user.user_id },
			});
			agency_id = foundUser?.agency_id;
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
			.where("u.role = :role", { role: RoleType.NEW_MEMBER })
			.limit(dto.limit)
			.offset(pageSize);

		if (agency_id) {
			userQuery.andWhere("u.agency_id = :agency_id", { agency_id });
		}

		if (dto.city_id) {
			userQuery = userQuery.where("u.city_id = :city_id", {
				city_id: dto.city_id,
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
					qb.where(
						"CONCAT(u.first_name, ' ', u.last_name) ILIKE :fullname",
						{
							fullname: `%${dto.text}%`,
						},
					)
						.orWhere("u.phone ILIKE :phone", {
							phone: `%${dto.text}%`,
						})
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

		const metaData = BaseDto.create<UserEntity[]>();
		metaData.setPagination(usersCount, dto.page, dto.limit);
		metaData.data = users;
		return metaData;
	}

	async readOne(id: number, select?: FindOptionsSelect<UserEntity>) {
		const foundUser = await this.userRepository.findOne({
			select: select ? { id: true, ...select } : undefined, // NOTE: If id is not provided it returns null
			where: {
				id: id,
			},
			relations: { agency: true },
		});
		if (!foundUser) {
			throw new UserNotFoundError(`id: ${id}`);
		}
		return foundUser;
	}

	async readOneByKeycloakIdOrEmail(
		id: string,
		email: string,
		select?: FindOptionsSelect<UserEntity>,
	) {
		const foundUser = await this.userRepository.findOne({
			select: select ? { id: true, ...select } : undefined, // NOTE: If id is not provided it returns null
			where: [
				{
					keycloak_id: id,
				},
				{
					email,
				},
			],
		});

		return foundUser;
	}

	async search(dto: UserSearchDto): Promise<BaseDto<UserEntity[]>> {
		let queryBuilder = this.userRepository
			.createQueryBuilder("u")
			.where("u.role IN (:...roles)", {
				roles: [
					RoleType.MANAGER,
					RoleType.ADMIN,
					RoleType.AFFILIATE_MANAGER,
				],
			})
			.select([
				"u.id as id",
				"u.phone as phone_number",
				"CONCAT(u.firstName, ' ', u.lastName) AS fullname",
			]);

		queryBuilder = queryBuilder.andWhere(
			new Brackets((qb) =>
				qb
					.where(
						"CONCAT(u.firstName, ' ', u.lastName) ILIKE :fullname",
						{
							fullname: `%${dto.text}%`,
						},
					)
					.orWhere("u.phone ILIKE :phone_number", {
						phone_number: `%${dto.text}%`,
					}),
			),
		);

		const pageSize = (dto.page - 1) * dto.limit;
		queryBuilder = queryBuilder.limit(dto.limit).offset(pageSize);
		const [users, userCount] = await Promise.all([
			queryBuilder.getRawMany<UserEntity>(),
			queryBuilder.getCount(),
		]);

		const metaData = BaseDto.create<UserEntity[]>();
		metaData.setPagination(userCount, dto.page, dto.limit);
		metaData.data = users;
		return metaData;
	}

	async readOneWithRelation(id: number) {
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
				"keycloak_id",
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
		const foundUser = await this.readOneWithRelation(user_id);
		const userCreatedCount = await this.bookingRepository.count({
			where: {
				create_by_id: user_id,
				created_at: Between(
					new Date(
						new Date().getFullYear(),
						new Date().getMonth(),
						1,
					),
					new Date(
						new Date().getFullYear(),
						new Date().getMonth() + 1,
						0,
					),
				),
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
			remaining_user_creation_limit:
				settings.booking_limit - userCreatedCount,
		} as IUserCreation;

		if (
			foundUser.role === RoleType.HEAD_OF_AGENCY ||
			foundUser.role === RoleType.AGENT
		) {
			(metaData.meta.data as IUserCreation).max_user_creation_limit =
				settings.booking_limit;
		}
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
		const foundUser = await this.readOneWithRelation(dto.id);
		if (dto.city_id) {
			await this.cityService.checkExsits(dto.city_id);
		}
		if (dto.agency_id) {
			await this.agencyService.checkExsits(dto.agency_id);
		}
		const mergedUser = this.userRepository.merge(foundUser, dto);
		return await this.userRepository.save(mergedUser);
	}

	async update(id: number, dto: UserUpdateDto): Promise<UserEntity> {
		const user = await this.readOneWithRelation(id);
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
		return this.readOneWithRelation(id);
	}

	async updateToken(
		id: number,
		dto: UserUpdateTokenDto,
	): Promise<UserEntity> {
		await this.userRepository.update(id, dto);
		return this.readOneWithRelation(id);
	}

	async changePhone(
		id: number,
		dto: UserCreateDto,
	): Promise<UserResponseDto> {
		const user = await this.readOneWithRelation(id);
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
		const user = await this.readOneWithRelation(id);
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
		const foundUser = await this.readOneWithRelation(user.user_id);

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
		const foundUser = await this.readOneWithRelation(user.user_id);

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
		const foundUser = await this.readOneWithRelation(dto.user_id);
		const jwtBuffer: ICurrentUser = {
			user_id: foundUser.id,
			role: foundUser.role,
		};
		return {
			accessToken: this.jwtService.sign(jwtBuffer),
		};
	}

	async delete(id: number) {
		const foundUser = await this.readOneWithRelation(id);
		await this.userRepository.delete(foundUser.id);
		return foundUser;
	}

	async verifyUser(dto: UserVerifyDto) {
		const foundUser = await this.readOneWithRelation(dto.user_id);
		let userRole: RoleType = foundUser.role;
		if (dto.is_verified) {
			if (foundUser.temporary_role) {
				userRole = foundUser.temporary_role;
			} else {
				userRole = RoleType.AGENT;
			}
		}

		const response = await this.userQueueService.makeRequest(
			await this.userQueueService.createFormEntity({
				...foundUser,
				agency_id: foundUser.agency_id,
			}),
		);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const ext_id = response?.data?.successfully[0]?.id as unknown as string;

		await this.userRepository.update(foundUser.id, {
			role: userRole,
			is_verified: dto.is_verified,
			ext_id,
		});

		foundUser.is_verified = dto.is_verified;
		foundUser.role = userRole;
		return foundUser;
	}

	async getUserCountByDate(
		fromDate: Date,
		toDate: Date,
		role?: RoleType,
		city_id?: number,
	): Promise<IUserDailyStatistics[]> {
		const diffInDays =
			(new Date(toDate).getTime() - new Date(fromDate).getTime()) /
			(1000 * 60 * 60 * 24);

		const query = this.userRepository.createQueryBuilder("users");

		if (diffInDays < 365) {
			query
				.select("DATE(users.created_at)", "date")
				.groupBy("DATE(users.created_at)")
				.orderBy("DATE(users.created_at)", "ASC");
		} else {
			query
				.select("TO_CHAR(users.created_at, 'YYYY-MM')", "date")
				.groupBy("TO_CHAR(users.created_at, 'YYYY-MM')")
				.orderBy("TO_CHAR(users.created_at, 'YYYY-MM')", "ASC");
		}

		query
			.addSelect("COUNT(users.id)::INT", "count")
			.where("users.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			});

		if (role) {
			query.andWhere("users.role = :role", { role });
		}

		if (city_id) {
			query.andWhere("users.city_id = :city_id", { city_id });
		}

		const result: IUserDailyStatistics[] = await query.getRawMany();

		return result;
	}

	async getUserCountByActivity(
		fromDate: Date,
		toDate: Date,
		role?: RoleType,
		city_id?: number,
	): Promise<IUserDailyStatistics[]> {
		const diffInDays =
			(new Date(toDate).getTime() - new Date(fromDate).getTime()) /
			(1000 * 60 * 60 * 24);

		const query = this.userActivityRepository
			.createQueryBuilder("ua")
			.leftJoinAndSelect("ua.user", "user");

		if (diffInDays < 365) {
			query
				.select("DATE(ua.created_at)", "date")
				.groupBy("DATE(ua.created_at)")
				.orderBy("DATE(ua.created_at)", "ASC");
		} else {
			query
				.select("TO_CHAR(ua.created_at, 'YYYY-MM')", "date")
				.groupBy("TO_CHAR(ua.created_at, 'YYYY-MM')")
				.orderBy("TO_CHAR(ua.created_at, 'YYYY-MM')", "ASC");
		}

		query
			.addSelect("COUNT(ua.id)::INT", "count")
			.where("ua.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.andWhere("user.is_verified IS TRUE");

		if (role) {
			query.andWhere("user.role = :role", { role });
		}

		if (city_id) {
			query.andWhere("user.city_id = :city_id", { city_id });
		}

		const result: IUserDailyStatistics[] = await query.getRawMany();

		return result;
	}

	async getUserCountByCity(
		fromDate: Date,
		toDate: Date,
		type?: UserFilterByDateEnum,
	): Promise<IUserStatisticsByCity[]> {
		let query = this.userRepository
			.createQueryBuilder("user")
			.leftJoin("user.city", "city")
			.select(["city.name AS city_name", "COUNT(user.id)::INT AS count"])
			.where("user.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			});

		if (type) {
			if (type === UserFilterByDateEnum.ACTIVE_AGENT) {
				query = query
					.andWhere("user.role = :agent", { agent: RoleType.AGENT })
					.andWhere("user.is_verified = true");
			} else if (type === UserFilterByDateEnum.ACTIVE_WORKER) {
				query = query
					.andWhere("user.role != :agent", {
						agent: RoleType.AGENT,
					})
					.andWhere("user.role != :head_of_agency", {
						head_of_agency: RoleType.HEAD_OF_AGENCY,
					})
					.andWhere("user.is_verified = true");
			} else if (type === UserFilterByDateEnum.REGISTERED_AGENT) {
				query = query.andWhere("user.role = :agent", {
					agent: RoleType.AGENT,
				});
			}
		}

		query.groupBy("city.id").orderBy("city.name", "ASC");

		const result: IUserStatisticsByCity[] = await query.getRawMany();

		return result;
	}

	async createOrFindActivity(
		user_id: number,
		created_at: Date,
	): Promise<UserActivityEntity> {
		const startOfDay = new Date(created_at.setHours(0, 0, 0, 0));
		const endOfDay = new Date(created_at.setHours(23, 59, 59, 999));

		const existingActivity = await this.userActivityRepository.findOne({
			where: {
				user_id,
				created_at: Between(startOfDay, endOfDay),
			},
		});

		if (existingActivity) {
			return existingActivity;
		}

		const newActivity = this.userActivityRepository.create({
			user_id,
		});

		return await this.userActivityRepository.save(newActivity);
	}

	async readOneByExtId<T extends FindOptionsSelect<UserEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<UserEntity, T>> {
		const client = await this.userRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new UserNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}
}
