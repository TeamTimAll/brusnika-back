## Kounter server

### Brusnika API'dan olish kerak bo'lgan ma'lumotlar:

<br>Ikkala server orasida ma'lumot `WebSocket` bilan almashinadi. <br>Ikkala
server orasida ma'lumot almashinish uchun JSON ko'rinishi `data` va `error` dan
tashkil topgan. <br>Error'ni ko'rinishi:

```json
{
	"data": null,
	"error": {
		"id": 400,
		"labels": {
			"en": "Client connection denied!",
			"ru": "Client connection denied!",
			"uz": "Client connection denied!"
		},
		"meta": {
			"message": "Invalid custom header"
		}
	}
}
```

-   id - unique, hamda aynan bir error'ni anglatadi.
-   labels - error habari
-   meta - meta ma'lumot.

<br>Ma'lumotda uning turi `type` va `data`'ni ichida `type`'ga nisbattan
ma'lumot shakli beriladi. <br>Brusnikadan kelgan ma'lumotlar log shaklida
yoziladi. Har bir o'zgarish `update_id` sequence oraqli saqlanadi. <br>`data`'ni
ichidagi `update_id` Sequence bildiradi. <br>`data`'ni ichidagi `ext_id`
(external id) ikkala server orasidagi ma'lumotni tanish uchun ishlatiladigan id.
Bu id unique. ext_id orqali "create to update" funksiyanali ishlaydi.

<br>`Project` - faqat kounter'dan asosiy backend'ga ma'lumot yuboriladi.
<br>Event nomi: `events`. <br>Ma'lumot ko'rinishi:

```json
{
	"data": {
		"type": "project",
		"data": {
			"ext_id": "string",
			"name": "string",
			"detailed_description": "string",
			"brief_description": "string",
			"photo": "string",
			"price": "number",
			"location": "string",
			"long": "string",
			"lat": "string",
			"link": "string",
			"end_date": "Date",
			"city_ext_id": "string"
		}
	},
	"error": null
}
```

<br>Building - faqat kounter'dan asosiy backend'ga ma'lumot yuboriladi.
<br>Event nomi: `events`. <br>Ma'lumot ko'rinishi:

```json
{
	"data": {
		"type": "building",
		"data": {
			"ext_id": "string",
			"name": "string",
			"total_storage": "number",
			"total_vacant_storage": "number",
			"total_parking_space": "number",
			"total_vacant_parking_space": "number",
			"total_commercial": "number",
			"total_vacant_commercial": "number",
			"address": "string",
			"number_of_floors": "number",
			"project_ext_id": "string"
		}
	},
	"error": null
}
```

<br>Section - faqat kounter'dan asosiy backend'ga ma'lumot yuboriladi. <br>
Event nomi: `events`. <br> Ma'lumot ko'rinishi:

```json
{
	"data": {
		"type": "section",
		"data": {
			"ext_id": "string",
			"name": "string",
			"building_ext_id": "string"
		}
	},
	"error": null
}
```

<br> Premise - faqat kounter'dan asosiy backend'ga ma'lumot yuboriladi. <br>
Event nomi: `events`. <br> Ma'lumot ko'rinishi:

```
enum PremisesType {
	APARTMENT	= "apartment",
	STOREROOM	= "storeroom",
	PARKING		= "parking",
	COMMERCIAL	= "commercial",
}

enum CommercialStatus {
	FREE	= "free",
	TAKEN	= "taken",
}

enum PuchaseOptions {
	MORTAGE			= "mortage",
	INSTALLMENT		= "installment",
	BILL			= "bill",
	FULL_PAYMENT	= "full_payment",
}
```

```json
{
	"data": {
		"type": "premise",
		"data": {
			"ext_id": "string",
			"name": "string",
			"type": "PremisesType",
			"building_ext_id": "string",
			"price": "bigint",
			"size": "number",
			"status": "CommercialStatus",
			"purchaseOption": "PuchaseOptions",
			"number": "number",
			"floor": "number",
			"photo": "string",
			"rooms": "number",
			"photos": "string[]",
			"similiarApartmentCount": "number",
			"schema_ext_id": "string",
			"link": "string",
			"season_ext_id": "string",
			"mortagePayment": "number",
			"section_ext_id": "string",
			"is_sold": "boolean"
		}
	},
	"error": null
}
```

<br>Lead - yasalishi Brusnika'dan kelsagina yasaladi. <br>Event nomi: `events`.
<br>Ma'lumot ko'rinishi:

```
enum LeadState {
	ACTIVE		= "Активные",
	IN_PROGRESS	= "На паузе",
	FAILED		= "Проиграна",
	COMPLETE	= "Выиграна",
}
```

```json
{
	"data": {
		"type": "lead",
		"data": {
			"ext_id": "string",
			"client_ext_id": "string",
			"agent_ext_id": "string",
			"manager_ext_id": "string",
			"project_ext_id": "string",
			"premise_ext_id": "string",
			"fee": "number",
			"lead_number": "number",
			"state": "LeadState"
		}
	},
	"error": null
}
```

<br>Lead status o'zgarishlari faqat kounter'dan asosiy backend'ga ma'lumot
yuboriladi. <br>Event nomi: `events`. <br>Ma'lumot ko'rinishi:

```
enum LeadOpStatus {
	OPEN					= "открыта",
	INTEREST_IN_PURCHASING	= "интерес к покупке",
	PRESENTATION			= "презентация",
	BOOKED					= "бронь",
	REQUEST_FOR_CONTRACT	= "заявка на договор",
	CONTRACT_IS_REGISTERED	= "договор зарегистрирован",
	WON						= "выиграна",
	BOOK_CANCELED			= "отмененная бронь",
	LOST_BOOK				= "слетевшая бронь",
	ON_PAUSE				= "на паузе",
	CHECK_LEAD				= "проверка лида",
	FAILED					= "проиграна",
}
```

```json
{
	"data": {
		"type": "lead_op",
		"data": {
			"lead_ext_id": "string",
			"status": "LeadOpStatus"
		}
	},
	"error": null
}
```

Savol:

1. lead state qayerda boshqariladi? Brusina state o'zgarishini yuboradimi yoki
   backend status o'zgarishiga qarab state'ni o'zgartiradimi?
2. Visit yasalganda Brusnikadan javob kutish kerakmi?
3. Visit qachon success bo'ladi?
4. Visit failed bo'lishi Brusnikaga bog'liqmi?
5. Visit failed qilinsa Brusnikaga so'rov jonatish kerakmi?
6. Booking yasalganda Brusnikadan javob kutish kerakmi?
7. Booking qachon success bo'ladi?
8. Booking failed bo'lishi Brusnikaga bog'liqmi?
9. Booking failed qilinsa Brusnikaga so'rov jonatish kerakmi?

<br>Time Slots - Calendar'da bo'sh joy borligini bildiruvchi ma'lumot. Brusnika
bilan bo'sh vaqtlar ro'yhati va uni egallash uchun ma'lumot almashilinadi.
<br>Event nomi: `events`. <br>Ma'lumot ko'rinishi:

```json
{
	"data": {
		"type": "time_slots",
		"data": {
			"ext_id": "string",
			"date": "YYYY-MM-DD",
			"time": "HH:mm",
			"is_booked": "boolean"
		}
	},
	"error": null
}
```

Kounter server'ga ma'lumot berishda ham shu ma'lumot shaklidan foydalaniladi.

<br>User - Brusnikadan berilgan user bor yoki yo'qligini tekshirib keladi.
User'ni brusnikadan block qila oladi. <br>SSO'da front token orqali userni
oladi, bu user'ni backend "create to update" qiladi. <br>Event nomi: `events`.
<br>Ma'lumot ko'rinishi:

```
enum RoleType {
	ADMIN             = "ADMIN",              // Администрация
	AGENT             = "AGENT",              // Агент
	MANAGER           = "MANAGER",            // Менеджер
	NEW_MEMBER        = "NEW_MEMBER",         // Новый участник
	HEAD_OF_AGENCY    = "HEAD_OF_AGENCY",     // Руководитель агентства
	OZK_MANAGER       = "OZK_MANAGER",        // Менеджер
	AFFILIATE_MANAGER = "AFFILIATE_MANAGER",  // Партнерский менеджер
}

enum UserStatus {
	ACTIVE	= "active",
	BLOCKED	= "blocked",
}
```

```json
{
	"data": {
		"type": "user",
		"data": {
			"ext_id": "string",
			"firstName": "string",
			"lastName": "string",
			"role": "RoleType",
			"email": "string",
			"username": "string",
			"password": "string",
			"phone": "string",
			"birthDate": "Date",
			"workStartDate": "Date",
			"avatar": "string",
			"status": "UserStatus",
			"city_id": "number",
			"agency_id": "number"
		}
	},
	"error": null
}
```

Savol:

1. User verify qilish faqat bizni backenddan qilinadimi yoki Brusnikaga ham
   bunday imkoniyat berilganmi?

<br>Agency - Brusnikadan berilgan agency bor yoki yo'qligini tekshirib keladi.

Savol:

1. Agency'ga qo'shilish uchun Brusnikaga so'rov yuborilishi kerakmi?

<br>Client - Brusnikaga yasalgan client'ni yuboriladi. Uning zakrepliniya
(fixing type)'ni Brusnika tarafdan o'zgartiriladi.

```
enum ConfirmationType {
	PHONE	= "звонок",
	SMS		= "смс",
}

enum FixingType {
	LEAD_VERIFICATION	= "проверка лида",
	CENCEL_FIXING		= "отказ в закреплении",
	WEAK_FIXING			= "слабое закрепление",
	STRONG_FIXING		= "сильное закрепление",
}
```

```json
{
	"data": {
		"type": "client",
		"data": {
			"ext_id": "string",
			"fullname": "string",
			"phone_number": "string",
			"actived_date": "Date",
			"comment": "string",
			"confirmation_type": "ConfirmationType",
			"fixing_type": "FixingType",
			"expiration_date": "Date",
			"node": "string",
			"agent_ext_id": "number"
		}
	},
	"error": null
}
```

Fixing type o'zgarishi:

```json
{
	"data": {
		"type": "client_fixing",
		"data": {
			"client_ext_id": "string",
			"fixing_type": "FixingType"
		}
	},
	"error": null
}
```

---

### Integratsiya logikasi qilinmaganlar

-   Lead Task:
-   Task

### Task

- [x] Ikkita service'da Message queue bilan ma'lumot almashishni o'rnatish.
- [x] Brusnikadan olish kerak bo'lgan ma'lumotlarni asosiy server'dan qabul qilivchi queue ochish.
- [ ] Brusnikaga berish kerak bo'lgan ma'lumotlarni kontur server'dan qabul qilivchi queue'lar ochish.
	- [ ] User auth integration logic'ni ko'rib chiqish kerak.
	- [x] Client create qilganida Brusnika'ga ma'lumot jo'natish kerak.
	- [x] Visit'ga o'tkazish uchun so'rov.
	- [ ] Visit status o'zgarishi haqida habar beruvchi queue.
	- [x] Bron'ga o'tkazish uchun so'rov.
	- [ ] Bron status o'zgarishi haqida habar beruvchi queue.
- [ ] Kontur brusnikadan oladigan ma'lumot mapping'ni data validation bilan qabul qilish.
- [ ] Kontur'da Mapping logikasini qilish.
- [ ] Kontur'da database shaklini to'g'irlash.

1. URL is not working: https://ekaterinburg.brusnika.ru/feed/pantry/rieltory-kladovye-ekaterinburg/
2. City ma'lumotlarni alohida API' qilib berilishi kerak.
3. Project ma'lumotlarni alohida API' qilib berilishi kerak. City bilan bog'liqligi uchun id bilan ishlatilishi kerak.
4. Building (объект) ma'lumotlari yo'q va alohida API'da berishi kerak. id'si orqali bizning kontur tanib oladi. Project bilan bog'liqligi uchun id bilan ishlatilishi kerak.
5. Section ma'lumotlarni alohida API' qilib berilishi kerak. Building bilan bog'liqligi uchun id bilan ishlatilishi kerak.
6. Premise bilan Section va Building bog'liqligi uchun id bilan ishlatilishi kerak.

1. URL не работает: https://ekaterinburg.brusnika.ru/feed/pantry/rieltory-kladovye-ekaterinburg/
2. Данные по городу должны быть предоставлены отдельным API.
3. Данные по проекту должны быть предоставлены отдельным API и использоваться через id, так как они связаны с городом.
4. Данные по объекту (зданию) отсутствуют и должны быть предоставлены через отдельный API. Наш контур распознает их по id. Для связи с проектом необходимо использовать id.
5. Данные по секции должны быть предоставлены отдельным API и использоваться через id, так как они связаны с объектом.
6. Для связи помещения с секцией и объектом необходимо использовать id.
