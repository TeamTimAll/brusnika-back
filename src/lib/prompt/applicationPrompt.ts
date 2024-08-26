import { IPromptMap } from "./prompt";

export enum ApplicationPromptID {
	// Auth Errors
	UNAUTHORIZED_ERROR = 270,
	USER_PASSWORD_IS_NOT_CORRECT_ERROR = 271,
	PERMISSION_DENIED_ERROR = 273,
	// INVALID_TOKEN_ERROR = 271,
	// TOKEN_EXPIRED_ERROR = 272,

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
	EVENTS_NOT_FOUND_ERROR = 415,
	NEWS_LIKE_NOT_ENABLED_ERROR = 416,
	EVENT_INVITATION_NOT_FOUND_ERROR = 417,
	EVENT_REACHED_MAXIMUM_VISITORS_ERROR = 418,
	USER_ALREADY_REGISTERED_TO_EVENT_ERROR = 419,
	TRAINING_NOT_FOUND_ERROR = 420,
	TRAINING_CATEGORY_NOT_FOUND_ERROR = 421,
	NEWS_CATEGORY_NOT_FOUND_ERROR = 422,
	SECTION_NOT_FOUND_ERROR = 423,
	SETTINGS_NOT_FOUND_ERROR = 424,
	COMMENT_NOT_FOUND_ERROR = 425,
	MAX_CREATABLE_BOOKING_COUNT_REACHED_ERROR = 433,
	NOTIFICATION_NOT_FOUND_ERROR = 434,
	USER_BLOCKED_ERROR = 435,
	CONTACT_NOT_FOUND_ERROR = 436,

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
	[ApplicationPromptID.PERMISSION_DENIED_ERROR]: {
		promptId: ApplicationPromptID.PERMISSION_DENIED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "permission_denied_error",
		promptLabels: {
			en: "Permission denied error",
			ru: "Доступ запрещен.",
			uz: "Permission denied error",
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
	[ApplicationPromptID.EVENTS_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.EVENTS_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "events_not_found_error",
		promptLabels: {
			en: "Events not found error",
			ru: "Ошибка события не найдены",
			uz: "Events not found error",
		},
	},
	[ApplicationPromptID.NOTIFICATION_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.NOTIFICATION_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "notification_not_found_error",
		promptLabels: {
			en: "Notification not found error",
			ru: "Notification not found error",
			uz: "Notification not found error",
		},
	},
	[ApplicationPromptID.EVENT_REACHED_MAXIMUM_VISITORS_ERROR]: {
		promptId: ApplicationPromptID.EVENT_REACHED_MAXIMUM_VISITORS_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "event_reached_maximum_visitors_error",
		promptLabels: {
			en: "Event reached maximum visitors error",
			ru: "Превышено максимальное количество участников в мероприятии.",
			uz: "Event reached maximum visitors error",
		},
	},
	[ApplicationPromptID.USER_ALREADY_REGISTERED_TO_EVENT_ERROR]: {
		promptId: ApplicationPromptID.USER_ALREADY_REGISTERED_TO_EVENT_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_already_registered_to_event_error",
		promptLabels: {
			en: "User already registered to event error",
			ru: "Ошибка пользователь уже зарегистрирован на событие",
			uz: "User already registered to event error",
		},
	},
	[ApplicationPromptID.NEWS_LIKE_NOT_ENABLED_ERROR]: {
		promptId: ApplicationPromptID.NEWS_LIKE_NOT_ENABLED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "news_like_not_enabled_error",
		promptLabels: {
			en: "News like not enabled error",
			ru: "Ошибка новости лайки не включены",
			uz: "News like not enabled error",
		},
	},
	[ApplicationPromptID.EVENT_INVITATION_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.EVENT_INVITATION_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "event_invition_not_found_error",
		promptLabels: {
			en: "Event invition not found error",
			ru: "Ошибка мероприятие не найдено.",
			uz: "Event invition not found error",
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
	[ApplicationPromptID.TRAINING_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.TRAINING_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "training_not_found_error",
		promptLabels: {
			en: "Training not found error",
			ru: "Ошибка «Обучение не найдено»",
			uz: "Training not found error",
		},
	},
	[ApplicationPromptID.TRAINING_CATEGORY_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.TRAINING_CATEGORY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "trainings_category_not_found_error",
		promptLabels: {
			en: "Trainings category not found error",
			ru: "Категория тренингов не найдена ошибка",
			uz: "Trainings category not found error",
		},
	},
	[ApplicationPromptID.NEWS_CATEGORY_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.NEWS_CATEGORY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "news_category_not_found_error",
		promptLabels: {
			en: "News category not found error",
			ru: "Категория новостей не найдена ошибка",
			uz: "News category not found error",
		},
	},
	[ApplicationPromptID.SECTION_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.SECTION_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "section_not_found_error",
		promptLabels: {
			en: "Section not found error",
			ru: "Ошибка «Раздел не найден»",
			uz: "Section not found error",
		},
	},
	[ApplicationPromptID.SETTINGS_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.SETTINGS_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "settings_not_found_error",
		promptLabels: {
			en: "Settings not found error",
			ru: "Ошибка «Настройки не найдены»",
			uz: "Settings not found error",
		},
	},
	[ApplicationPromptID.COMMENT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.COMMENT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "comment_not_found_error",
		promptLabels: {
			en: "Comment not found error",
			ru: "Ошибка «Комментарий не найден»",
			uz: "Comment not found error",
		},
	},
	[ApplicationPromptID.MAX_CREATABLE_BOOKING_COUNT_REACHED_ERROR]: {
		promptId: ApplicationPromptID.MAX_CREATABLE_BOOKING_COUNT_REACHED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "max_creatable_booking_count_reached_error",
		promptLabels: {
			en: "Max creatable booking count reached error",
			ru: "Ошибка: достигнуто максимальное количество создаваемых бронирований.",
			uz: "Max creatable booking count reached error",
		},
	},
	[ApplicationPromptID.USER_BLOCKED_ERROR]: {
		promptId: ApplicationPromptID.USER_BLOCKED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_blocked_error",
		promptLabels: {
			en: "You are denied access (Contact the administration)",
			ru: "Вам отказано в доступе (Обратитесь к администрации)",
			uz: "You are denied access (Contact the administration)",
		},
	},
	[ApplicationPromptID.CONTACT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.CONTACT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "contact_not_found_error",
		promptLabels: {
			en: "Contact not found error",
			ru: "Ошибка «Контакт не найден»",
			uz: "Contact not found error",
		},
	},
};
