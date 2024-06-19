import { IPromptMap } from "./prompt";

export enum ApplicationPromptID {
	// Auth Errors
	UNAUTHORIZED_ERROR = 270,
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

	// Event errors
	USER_EMAIL_ALREADY_EXISTS_ERROR = 311,
	VERIFICATION_EXISTS_ERROR = 312,
	AGENCY_NOT_FOUND_ERROR = 313,
	VERIFICATION_CODE_EXPIRED_ERROR = 314,
	VERIFICATION_CODE_IS_NOT_CORRECT_ERROR = 315,
	NO_VERIFICATION_CODE_SENT_ERROR = 316,
}

export const ApplicationPrompts: IPromptMap<ApplicationPromptID> = {
	[ApplicationPromptID.INPUT_VALIDATION_ERROR]: {
		promptId: ApplicationPromptID.INPUT_VALIDATION_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "input_validation_error",
		promptLabels: [
			"Input validation error",
			"Ошибка проверки ввода",
			"Input validation error",
		],
	},
	[ApplicationPromptID.METHOD_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.METHOD_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "method_not_found_error",
		promptLabels: [
			"Method not found error",
			"Ошибка метод не найден",
			"Method not found error",
		],
	},
	[ApplicationPromptID.INTERNAL_SERVER_ERROR]: {
		promptId: ApplicationPromptID.INTERNAL_SERVER_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "internal_server_error",
		promptLabels: [
			"Internal server error",
			"Внутренняя ошибка сервера",
			"Internal server error",
		],
	},
	[ApplicationPromptID.UNAUTHORIZED_ERROR]: {
		promptId: ApplicationPromptID.UNAUTHORIZED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "unauthorized_error",
		promptLabels: [
			"Unauthorized error",
			"Ошибка доступа",
			"Unauthorized error",
		],
	},
	[ApplicationPromptID.USER_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.USER_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_not_found_error",
		promptLabels: [
			"User not found error",
			"Пользователь не найден",
			"User not found error",
		],
	},
	[ApplicationPromptID.CITY_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.CITY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "city_not_found_error",
		promptLabels: [
			"City not found error",
			"Город не найден",
			"City not found error",
		],
	},
	[ApplicationPromptID.PROJECT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PROJECT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "project_not_found_error",
		promptLabels: [
			"Project not found error",
			"Проект не найден",
			"Project not found error",
		],
	},
	[ApplicationPromptID.BUILDING_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.BUILDING_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "building_not_found_error",
		promptLabels: [
			"Building not found error",
			"Здание не найдено",
			"Building not found error",
		],
	},
	[ApplicationPromptID.PREMISE_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PREMISE_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "premise_not_found_error",
		promptLabels: [
			"Premise not found error",
			"Помещение не найдено",
			"Premise not found error",
		],
	},
	[ApplicationPromptID.PREMISES_BASKET_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PREMISES_BASKET_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "premises_basket_meta_not_found_error",
		promptLabels: [
			"Premises basket meta not found error",
			"Мета-информация о корзине помещений не найдена",
			"Premises basket meta not found error",
		],
	},
	[ApplicationPromptID.PREMISES_BASKET_META_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PREMISES_BASKET_META_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "premises_basket_not_found_error",
		promptLabels: [
			"Premises basket not found error",
			"Корзина помещений не найдена",
			"Premises basket not found error",
		],
	},
	[ApplicationPromptID.AGENCY_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.AGENCY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "agency_not_found_error",
		promptLabels: [
			"Agency not found error",
			"Агентство не найдено",
			"Agency not found error",
		],
	},
	[ApplicationPromptID.CLIENT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.CLIENT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "client_not_found_error",
		promptLabels: [
			"Client not found error",
			"Клиент не найден",
			"Client not found error",
		],
	},
	[ApplicationPromptID.USER_EMAIL_ALREADY_EXISTS_ERROR]: {
		promptId: ApplicationPromptID.USER_EMAIL_ALREADY_EXISTS_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_already_exists_error",
		promptLabels: [
			"User email already exists. Try diffrent one.",
			"Пользователь с таким email уже существует. Попробуйте другой.",
			"User email already exists. Try diffrent one.",
		],
	},
	[ApplicationPromptID.VERIFICATION_EXISTS_ERROR]: {
		promptId: ApplicationPromptID.VERIFICATION_EXISTS_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "verification_exists_error",
		promptLabels: [
			"A valid verification code already exists or wait till expire.",
			"Уже существует действующий код верификации или подождите, пока истечет срок его действия.",
			"A valid verification code already exists or wait till expire.",
		],
	},
	[ApplicationPromptID.VERIFICATION_CODE_EXPIRED_ERROR]: {
		promptId: ApplicationPromptID.VERIFICATION_CODE_EXPIRED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "verification_code_expired_error",
		promptLabels: [
			"Verification code expired error",
			"Срок действия кода верификации истек",
			"Verification code expired error",
		],
	},
	[ApplicationPromptID.VERIFICATION_CODE_IS_NOT_CORRECT_ERROR]: {
		promptId: ApplicationPromptID.VERIFICATION_CODE_IS_NOT_CORRECT_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "verification_code_is_not_correct_error",
		promptLabels: [
			"Verification code is not correct error",
			"Неверный код верификации",
			"Verification code is not correct error",
		],
	},
	[ApplicationPromptID.NO_VERIFICATION_CODE_SENT_ERROR]: {
		promptId: ApplicationPromptID.NO_VERIFICATION_CODE_SENT_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "no_verification_code_sent_error",
		promptLabels: [
			"No verification code sent error",
			"Ошибка: код верификации не отправлен",
			"No verification code sent error",
		],
	},
};
