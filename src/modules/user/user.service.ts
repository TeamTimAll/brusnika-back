import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, type FindOptionsWhere } from "typeorm";

import { Uuid } from "boilerplate.polyfill";
import { ICurrentUser } from "interfaces/current-user.interface";

import {
	UserChangePhoneVerifyCodeDto,
	UserCreateDto,
	type UserDto,
} from "./dtos/user.dto";
import { UserNotFoundError } from "./errors/UserNotFound.error";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	hasOneMinutePassed(startTime: Date): boolean {
		const oneMinute = 60 * 1000; // 60 seconds * 1000 milliseconds
		const currentTime = new Date();
		const elapsedTime = currentTime.getTime() - startTime.getTime();
		return elapsedTime >= oneMinute;
	}

	findOne(
		findData: FindOptionsWhere<UserEntity>,
	): Promise<UserEntity | null> {
		return this.userRepository.findOneBy(findData);
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

	// async getUsers(
	//   pageOptionsDto: UsersPageOptionsDto,
	// ): Promise<PageDto<UserDto>> {
	//   const queryBuilder = this.userRepository.createQueryBuilder('user');
	//   const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

	//   return items.toPageDto(pageMetaDto);
	// }

	async getUser(userId: Uuid, full = true): Promise<UserDto> {
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

	async updateUser(
		id: Uuid,
		updateEventsDto: Partial<UserDto>,
	): Promise<unknown> {
		const user = this.findOne({
			id,
		});

		if (user === null || typeof user === "undefined") {
			throw new UserNotFoundError();
		}

		return await this.userRepository.update(
			id,
			updateEventsDto as UserEntity,
		);
	}

	async changePhone(id: Uuid, dto: UserCreateDto): Promise<unknown> {
		const user = await this.findOne({
			id,
		});

		if (!user) {
			throw new UserNotFoundError();
		}

		if (
			user.verification_code_sent_date &&
			!this.hasOneMinutePassed(user.verification_code_sent_date)
		) {
			return new HttpException(
				{
					error: "A valid verification code already exists or wait till expire",
				},
				HttpStatus.CONFLICT,
			);
		}

		// const randomNumber = Math.floor(100000 + Math.random() * 900000);
		const randomNumber = 111111;

		await this.updateUser(user.id, {
			verification_code: randomNumber,
			verification_code_sent_date: new Date(),
			temporaryNumber: dto.phone,
		});

		// todo send sms

		return new HttpException(
			{ userId: user.id, message: "sms sent" },
			HttpStatus.OK,
		);
	}

	async verifySmsCode(
		user: ICurrentUser,
		dto: UserChangePhoneVerifyCodeDto,
	): Promise<unknown> {
		try {
			const foundUser = await this.getUser(user.user_id);

			if (!foundUser) {
				return new HttpException(
					"User not found",
					HttpStatus.NOT_FOUND,
				);
			}

			if (foundUser.isPhoneVerified) {
				if (foundUser.verification_code_sent_date) {
					if (
						this.hasOneMinutePassed(
							foundUser.verification_code_sent_date,
						)
					) {
						return new HttpException(
							{
								error: "verification code expired",
							},
							HttpStatus.GONE,
						);
					} else {
						if (foundUser.verification_code === dto.code) {
							await this.updateUser(foundUser.id, {
								phone: foundUser.temporaryNumber,
								temporaryNumber: null,
								verification_code: null,
								verification_code_sent_date: null,
								isPhoneVerified: true,
							});
							return {
								message: "Verification code is correct",
							};
						} else {
							return new HttpException(
								{
									error: "Verification code is not correct",
								},
								HttpStatus.BAD_REQUEST,
							);
						}
					}
				}
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Login error:", error.message);
				return new HttpException(error.message, 500);
			}
		}
	}

	async agentLoginResendSmsCode(currentUser: ICurrentUser): Promise<unknown> {
		try {
			const user = await this.getUser(currentUser.user_id);

			if (!user) {
				return new HttpException(
					"User not found",
					HttpStatus.NOT_FOUND,
				);
			}

			if (user.verification_code_sent_date) {
				if (this.hasOneMinutePassed(user.verification_code_sent_date)) {
					// const randomNumber = Math.floor(100000 + Math.random() * 900000);
					const randomNumber = 111111;

					// todo send sms
					await this.updateUser(user.id, {
						verification_code: randomNumber,
						verification_code_sent_date: new Date(),
					});

					return new HttpException(
						{ userId: user.id, message: "sms sent" },
						HttpStatus.OK,
					);
				} else {
					return new HttpException(
						{
							error: "A valid verification code already exists or wait till expire",
						},
						HttpStatus.CONFLICT,
					);
				}
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Login error:", error.message);
				return new HttpException(
					{ error: "internal server error" },
					500,
				);
			}
		}
	}
}
