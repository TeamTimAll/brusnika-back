import {
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AgenciesService } from "../../modules/agencies/agencies.service";
import {
	UserCreateDto,
	UserFillDataDto,
} from "../../modules/user/dtos/user.dto";
import { UserRegisterStatus } from "../../modules/user/user.entity";
import { UserService } from "../user/user.service";
import { AgenciesEntity } from "../../modules/agencies/agencies.entity";

import {
	AgentChooseAgencyDto,
	AgentLoginDto,
	AgentRegisterAgencyDto,
	AgentRequestAgencyDto,
	LoginSuccess,
	UserLoginDto,
	UserLoginResendCodeDto,
	UserLoginVerifyCodeDto,
} from "./dtos/user-login.dto";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private agenciesService: AgenciesService,
	) {}

	hasOneMinutePassed(startTime: Date): boolean {
		const oneMinute = 60 * 1000; // 60 seconds * 1000 milliseconds
		const currentTime = new Date();
		const elapsedTime = currentTime.getTime() - startTime.getTime();
		return elapsedTime >= oneMinute;
	}

	async createUser(body: UserCreateDto): Promise<any> {
		try {
			let user = await this.userService.findOne({
				phone: body.phone,
			});

			if (user) {
				if (
					user.register_status === UserRegisterStatus.FINISHED &&
					user?.isPhoneVerified
				) {
					return new HttpException(
						"User already exists. Go to login page",
						HttpStatus.CONFLICT,
					);
				} else if (
					user.isPhoneVerified &&
					user.register_status !== UserRegisterStatus.CREATED
				) {
					return new HttpException(
						{
							message: "user already on registiry",
							userId: user.id,
							register_status: user.register_status,
						},
						HttpStatus.BAD_REQUEST,
					);
				}
			}
			if (!user) {
				user = await this.userService.createUser(body);
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

			await this.userService.updateUser(user.id, {
				verification_code: randomNumber,
				verification_code_sent_date: new Date(),
			});

			return new HttpException(
				{ userId: user.id, message: "sms sent" },
				HttpStatus.OK,
			);
		} catch (error) {
			console.log(error, "Account creating error");
			return new HttpException("Something went wrong", 500);
		}
	}

	async agentFillData(body: UserFillDataDto): Promise<any> {
		try {
			const user = await this.userService.getUser(body.id);

			if (!user || !user.id) {
				return new HttpException(
					"user not found",
					HttpStatus.NOT_FOUND,
				);
			}

			if (user.register_status === UserRegisterStatus.CREATED) {
				const foundUser = await this.userService.findOne({
					email: body.email,
				});

				if (foundUser) {
					return new HttpException(
						"This email already exists in the system",
						HttpStatus.CONFLICT,
					);
				}

				await this.userService.updateUser(user.id, {
					register_status: UserRegisterStatus.FILLED,
					...body,
				});

				return {
					message: "ok",
				};
			} else {
				return new HttpException(
					{
						message: "user on different registiry",
						register_status: user.register_status,
					},
					HttpStatus.BAD_REQUEST,
				);
			}
		} catch (error) {
			console.log("Account creating error", error);
			return new HttpException("Something went wrong", 500);
		}
	}

	async agentChooseAgency(body: AgentChooseAgencyDto): Promise<any> {
		try {
			const user = await this.userService.getUser(body.userId);

			if (!user || !user.id) {
				return new HttpException(
					"user not found",
					HttpStatus.NOT_FOUND,
				);
			}

			if (user.register_status === UserRegisterStatus.FILLED) {
				const agency = await this.agenciesService.findOne(
					body.agency_id,
				);
				if (!agency?.data) {
					return new HttpException(
						"agency not found",
						HttpStatus.NOT_FOUND,
					);
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
			} else {
				return new HttpException(
					{
						message: "user on different registiry",
						register_status: user.register_status,
					},
					HttpStatus.BAD_REQUEST,
				);
			}
		} catch (error) {
			console.log("Account creating error", error);
			return new HttpException("Something went wrong", 500);
		}
	}

	async agentRegisterAgency(body: AgentRegisterAgencyDto): Promise<any> {
		try {
			const user = await this.userService.getUser(body.userId);

			if (!user || !user.id) {
				return new HttpException(
					"user not found",
					HttpStatus.NOT_FOUND,
				);
			}

			if (user.register_status === UserRegisterStatus.FILLED) {
				const newAgency =
					await this.agenciesService.create<AgenciesEntity>({
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
			} else {
				return new HttpException(
					{
						message: "user on different registiry",
						register_status: user.register_status,
					},
					HttpStatus.BAD_REQUEST,
				);
			}
		} catch (error) {
			console.log("Account creating error", error);
			return new HttpException("Something went wrong", 500);
		}
	}

	async agentRequestAgency(body: AgentRequestAgencyDto): Promise<any> {
		try {
			const user = await this.userService.getUser(body.userId);

			if (!user || !user.id) {
				return new HttpException(
					"user not found",
					HttpStatus.NOT_FOUND,
				);
			}

			if (user.register_status === UserRegisterStatus.FILLED) {
				const newAgency =
					await this.agenciesService.create<AgenciesEntity>({
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
			} else {
				return new HttpException(
					{
						message: "user on different registiry",
						register_status: user.register_status,
					},
					HttpStatus.BAD_REQUEST,
				);
			}
		} catch (error) {
			console.log("Account creating error", error);
			return new HttpException("Something went wrong", 500);
		}
	}

	async loginAccount(loginDto: UserLoginDto): Promise<LoginSuccess | any> {
		try {
			const user = await this.userService.findOne({
				email: loginDto.email,
			});

			if (!user) {
				console.log("User not found ");
				// send brunsika crm to get user
				// if(user) {
				// user.create(user)
				// user = newUser
				// } else {
				return new UnauthorizedException("User not found");
				// }
			}

			// if (user.password === null) {
			//   console.log('Users password is null');
			//   return new UnauthorizedException('Password not set');
			// }

			// const passwordMatch = await bcrypt.compare(
			//   loginDto.password,
			//   user.password,
			// );

			// if (!passwordMatch) {
			//   console.log('Password did not match');
			//   return new UnauthorizedException('Invalid email or password');
			// }

			// await this.nodemailer.sendMail();

			const { password, ...result } = user;
			return {
				accessToken: this.jwtService.sign(result),
			};
		} catch (error: any) {
			console.error("Login error:", error.message);
			return new HttpException("internal server error", 500);
		}
	}

	async agentLogin(
		agentLoginDto: AgentLoginDto,
	): Promise<LoginSuccess | any> {
		try {
			const user = await this.userService.findOne({
				phone: agentLoginDto.phone,
			});

			if (!user) {
				// send request crm backend and find user
				// if(user) {
				// save this user
				// } else {
				return new HttpException(
					"User not found",
					HttpStatus.NOT_FOUND,
				);
				// }
			}

			// if (
			// user.isPhoneVerified
			// user.register_status === UserRegisterStatus.FINISHED
			// ) {
			// todo send code to phone number
			// const randomNumber = Math.floor(100000 + Math.random() * 900000);
			const randomNumber = 111111;

			console.log(randomNumber, user.id);

			await this.userService.updateUser(user.id, {
				verification_code: randomNumber,
				verification_code_sent_date: new Date(),
			});

			return new HttpException(
				{ userId: user.id, message: "sms sent" },
				HttpStatus.OK,
			);
			// const { password, ...result } = user;
			// return {
			//   accessToken: this.jwtService.sign(result),
			// };
			// } else {
			// 	return new HttpException(
			// 		{
			// 			message: "user not verified or on different registiry",
			// 			userId: user.id,
			// 			register_status: user.register_status,
			// 		},
			// 		HttpStatus.BAD_REQUEST,
			// 	);
			// }
		} catch (error: any) {
			console.error("Login error:", error.message);
			return new HttpException(error.message, 500);
		}
	}

	async verifySmsCode(
		dto: UserLoginVerifyCodeDto,
	): Promise<LoginSuccess | any> {
		try {
			const user = await this.userService.getUser(dto.user_id);

			if (!user) {
				return new HttpException(
					"User not found",
					HttpStatus.NOT_FOUND,
				);
			}

			if (
				user.isPhoneVerified &&
				user.register_status === UserRegisterStatus.FINISHED
			) {
				if (user.verification_code_sent_date) {
					if (
						this.hasOneMinutePassed(
							user.verification_code_sent_date,
						)
					) {
						return new HttpException(
							{
								error: "verification code expired",
							},
							HttpStatus.GONE,
						);
					} else {
						if (user.verification_code === dto.code) {
							return {
								accessToken: this.jwtService.sign({
									user_id: user.id,
									role: user.role,
								}),
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
			} else {
				if (user.verification_code_sent_date) {
					if (
						this.hasOneMinutePassed(
							user.verification_code_sent_date,
						)
					) {
						console.log("Verification code expired");
						return new HttpException(
							{
								error: "verification code expired",
							},
							HttpStatus.GONE,
						);
					} else {
						console.log("Verification code is correct");
						if (user.verification_code === dto.code) {
							if (!user.register_status) {
								await this.userService.updateUser(user.id, {
									isPhoneVerified: true,
									register_status: UserRegisterStatus.CREATED,
								});
								return {
									user_id: user.id,
									message: "verified",
								};
							} else {
								return new HttpException(
									{
										message: "user on different registiry",
										register_status: user.register_status,
										user_id: user.id,
									},
									HttpStatus.BAD_REQUEST,
								);
							}
						} else {
							return new HttpException(
								{
									error: "Verification code is not correct",
								},
								HttpStatus.BAD_REQUEST,
							);
						}
					}
				} else {
					return new HttpException(
						{
							error: "No verification code sent",
						},
						HttpStatus.CONFLICT,
					);
				}
			}
		} catch (error: any) {
			console.error("Login error:", error.message);
			return new HttpException(error.message, 500);
		}
	}

	async agentLoginResendSmsCode(
		dto: UserLoginResendCodeDto,
	): Promise<LoginSuccess | any> {
		try {
			const user = await this.userService.findOne({
				phone: dto.user_id,
			});

			if (!user) {
				return new HttpException(
					"User not found",
					HttpStatus.NOT_FOUND,
				);
			}

			// if (user.settings?.isPhoneVerified) {
			// todo send code to phone number
			if (user.verification_code_sent_date) {
				if (this.hasOneMinutePassed(user.verification_code_sent_date)) {
					// const randomNumber = Math.floor(100000 + Math.random() * 900000);
					const randomNumber = 111111;

					console.log(randomNumber, user.id);

					await this.userService.updateUser(user.id, {
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
			// } else {
			//   // todo
			// }
		} catch (error: any) {
			console.error("Login error:", error.message);
			return new HttpException({ error: "internal server error" }, 500);
		}
	}

	async getUser(email: string): Promise<any> {
		try {
			const user = await this.userService.findByUsernameOrEmail({
				email,
			});
			if (!user) {
				return new HttpException(
					"User not found",
					HttpStatus.NOT_FOUND,
				);
			}
			return user;
		} catch (error: any) {
			console.log({
				errroGettingUser: error,
			});
			return new HttpException(error.message, 500);
		}
	}

	async getCity(): Promise<any> {
		try {
			// todo return city
		} catch (error: any) {
			console.log({
				errroGettingUser: error,
			});
			return new HttpException(error.message, 500);
		}
	}
}
