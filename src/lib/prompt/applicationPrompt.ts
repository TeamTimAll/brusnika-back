import { IPromptMap } from "./prompt";

export enum ApplicationPromptID {
	// Auth Errors
	UNAUTHORIZED_ERROR = 270,
	USER_PASSWORD_IS_NOT_CORRECT_ERROR = 271,
	// INVALID_TOKEN_ERROR = 271,
	// TOKEN_EXPIRED_ERROR = 272,
	// PERMISITION_DENIED_ERROR = 273,

	// Internal Errors
	INPUT_VALIDATION_ERROR = 300,
	METHOD_NOT_FOUND_ERROR = 301,
	INTERNAL_SERVER_ERROR = 302,

	// Module Errors
	USER_NOT_FOUND_ERROR = 403,
	CITY_NOT_FOUND_ERROR = 404,
	PROJECT_NOT_FOUND_ERROR = 405,
	BUILDING_NOT_FOUND_ERROR = 406,
	PREMISES_BASKET_META_NOT_FOUND_ERROR = 407,
	PREMISES_BASKET_NOT_FOUND_ERROR = 408,
	PREMISE_NOT_FOUND_ERROR = 409,
	CLIENT_NOT_FOUND_ERROR = 410,
	LEAD_NOT_FOUND_ERROR = 411,
	BOOKING_NOT_FOUND_ERROR = 412,
	VISIT_NOT_FOUND_ERROR = 413,
	NEWS_NOT_FOUND_ERROR = 414,

	// Event errors
	USER_EMAIL_ALREADY_EXISTS_ERROR = 311,
	VERIFICATION_EXISTS_ERROR = 312,
	AGENCY_NOT_FOUND_ERROR = 313,
	VERIFICATION_CODE_EXPIRED_ERROR = 314,
	VERIFICATION_CODE_IS_NOT_CORRECT_ERROR = 315,
	NO_VERIFICATION_CODE_SENT_ERROR = 316,
	USER_PHONE_NOT_VERIFIED_ERROR = 317,
}

export const ApplicationPrompts: IPromptMap<ApplicationPromptID> = {
	[ApplicationPromptID.INPUT_VALIDATION_ERROR]: {
		promptId: ApplicationPromptID.INPUT_VALIDATION_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "input_validation_error",
		promptLabels: {
			en: "Input validation error",
			ru: "Ошибка проверки ввода",
			uz: "Input validation error",
		},
	},
	[ApplicationPromptID.METHOD_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.METHOD_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "method_not_found_error",
		promptLabels: {
			en: "Method not found error",
			ru: "Ошибка метод не найден",
			uz: "Method not found error",
		},
	},
	[ApplicationPromptID.INTERNAL_SERVER_ERROR]: {
		promptId: ApplicationPromptID.INTERNAL_SERVER_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "internal_server_error",
		promptLabels: {
			en: "Internal server error",
			ru: "Внутренняя ошибка сервера",
			uz: "Internal server error",
		},
	},
	[ApplicationPromptID.UNAUTHORIZED_ERROR]: {
		promptId: ApplicationPromptID.UNAUTHORIZED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "unauthorized_error",
		promptLabels: {
			en: "Unauthorized error",
			ru: "Ошибка доступа",
			uz: "Unauthorized error",
		},
	},
	[ApplicationPromptID.USER_PASSWORD_IS_NOT_CORRECT_ERROR]: {
		promptId: ApplicationPromptID.USER_PASSWORD_IS_NOT_CORRECT_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_password_is_not_correct_error",
		promptLabels: {
			en: "The password is incorrect, check your keyboard layout",
			ru: "Указан неверный пароль, проверьте раскладку клавиатуры",
			uz: "The password is incorrect, check your keyboard layout",
		},
	},
	[ApplicationPromptID.USER_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.USER_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_not_found_error",
		promptLabels: {
			en: "User not found error",
			ru: "Пользователь не найден",
			uz: "User not found error",
		},
	},
	[ApplicationPromptID.CITY_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.CITY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "city_not_found_error",
		promptLabels: {
			en: "City not found error",
			ru: "Город не найден",
			uz: "City not found error",
		},
	},
	[ApplicationPromptID.NEWS_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.NEWS_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "news_not_found_error",
		promptLabels: {
			en: "News not found error",
			ru: "News not found error",
			uz: "News not found error",
		},
	},
	[ApplicationPromptID.PROJECT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PROJECT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "project_not_found_error",
		promptLabels: {
			en: "Project not found error",
			ru: "Проект не найден",
			uz: "Project not found error",
		},
	},
	[ApplicationPromptID.BUILDING_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.BUILDING_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "building_not_found_error",
		promptLabels: {
			en: "Building not found error",
			ru: "Здание не найдено",
			uz: "Building not found error",
		},
	},
	[ApplicationPromptID.PREMISE_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PREMISE_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "premise_not_found_error",
		promptLabels: {
			en: "Premise not found error",
			ru: "Помещение не найдено",
			uz: "Premise not found error",
		},
	},
	[ApplicationPromptID.PREMISES_BASKET_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PREMISES_BASKET_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "premises_basket_meta_not_found_error",
		promptLabels: {
			en: "Premises basket meta not found error",
			ru: "Мета-информация о корзине помещений не найдена",
			uz: "Premises basket meta not found error",
		},
	},
	[ApplicationPromptID.PREMISES_BASKET_META_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PREMISES_BASKET_META_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "premises_basket_not_found_error",
		promptLabels: {
			en: "Premises basket not found error",
			ru: "Корзина помещений не найдена",
			uz: "Premises basket not found error",
		},
	},
	[ApplicationPromptID.AGENCY_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.AGENCY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "agency_not_found_error",
		promptLabels: {
			en: "Agency not found error",
			ru: "Агентство не найдено",
			uz: "Agency not found error",
		},
	},
	[ApplicationPromptID.CLIENT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.CLIENT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "client_not_found_error",
		promptLabels: {
			en: "Client not found error",
			ru: "Клиент не найден",
			uz: "Client not found error",
		},
	},
	[ApplicationPromptID.BOOKING_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.BOOKING_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "booking_not_found_error",
		promptLabels: {
			en: "Booking not found error",
			ru: "Бронирование не найдено",
			uz: "Booking not found error",
		},
	},
	[ApplicationPromptID.VISIT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.VISIT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "visit_not_found_error",
		promptLabels: {
			en: "Visit not found error",
			ru: "Визит не найден",
			uz: "Visit not found error",
		},
	},
	[ApplicationPromptID.USER_EMAIL_ALREADY_EXISTS_ERROR]: {
		promptId: ApplicationPromptID.USER_EMAIL_ALREADY_EXISTS_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_already_exists_error",
		promptLabels: {
			en: "User email already exists. Try diffrent one.",
			ru: "Пользователь с таким email уже существует. Попробуйте другой.",
			uz: "User email already exists. Try diffrent one.",
		},
	},
	[ApplicationPromptID.VERIFICATION_EXISTS_ERROR]: {
		promptId: ApplicationPromptID.VERIFICATION_EXISTS_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "verification_exists_error",
		promptLabels: {
			en: "A valid verification code already exists or wait till expire.",
			ru: "Уже существует действующий код верификации или подождите, пока истечет срок его действия.",
			uz: "A valid verification code already exists or wait till expire.",
		},
	},
	[ApplicationPromptID.VERIFICATION_CODE_EXPIRED_ERROR]: {
		promptId: ApplicationPromptID.VERIFICATION_CODE_EXPIRED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "verification_code_expired_error",
		promptLabels: {
			en: "Verification code expired error",
			ru: "Срок действия кода верификации истек",
			uz: "Verification code expired error",
		},
	},
	[ApplicationPromptID.VERIFICATION_CODE_IS_NOT_CORRECT_ERROR]: {
		promptId: ApplicationPromptID.VERIFICATION_CODE_IS_NOT_CORRECT_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "verification_code_is_not_correct_error",
		promptLabels: {
			en: "Verification code is not correct error",
			ru: "Неверный код верификации",
			uz: "Verification code is not correct error",
		},
	},
	[ApplicationPromptID.NO_VERIFICATION_CODE_SENT_ERROR]: {
		promptId: ApplicationPromptID.NO_VERIFICATION_CODE_SENT_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "no_verification_code_sent_error",
		promptLabels: {
			en: "No verification code sent error",
			ru: "Ошибка: код верификации не отправлен",
			uz: "No verification code sent error",
		},
	},
	[ApplicationPromptID.USER_PHONE_NOT_VERIFIED_ERROR]: {
		promptId: ApplicationPromptID.USER_PHONE_NOT_VERIFIED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_phone_not_verified_error",
		promptLabels: {
			en: "User phone not verified error",
			ru: "Ошибка: Номер пользователя не подтвержден",
			uz: "User phone not verified error",
		},
	},
	[ApplicationPromptID.LEAD_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.LEAD_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "lead_not_found_error",
		promptLabels: {
			en: "Lead not found error",
			ru: "Ошибка лида не найдена",
			uz: "Lead not found error",
		},
	},
};
