# Integration of Kontur and Brusnika

Brusnika va kontur integratsiyasi `Kafka` yoki `Rest API` orqali amalga
oshiriladi.

## Integratsiya qilinadigan ma'lumotlar

1. Brusnika'dan Kontur'ga kiruvchi ma'lumotlar:

-   Города (Cities)
    -   [METHOD] Get list
-   Проекты (Projects)
    -   [METHOD] Get list
-   Здания (Buildings)
    -   [METHOD] Get list
-   Разделы (Sections)
    -   [METHOD] Get list
-   Помещения (Premises)
    -   [METHOD] Get list
-   Сделки и статусы (Leads and statuses)
    -   [METHOD] Get list
-   Свободные Слоты для календаря (Time Slots)
    -   [METHOD] Get list

2. Kontur'dan Brusnika'ga beruvchi ma'lumotlar va method'lar:

-   Пользователи (Users)
-   Агентства (Agencies)
    -   [METHOD] Create agency
    -   [METHOD] Search agency
-   Клиенты (Clients)
    -   [METHOD] Create client
    -   [METHOD] Search client
-   Бронирование (Bookings)
    -   [METHOD] Create booking
    -   [METHOD] Cencel booking
-   Показы (Visits)
    -   [METHOD] Create visit
    -   [METHOD] Cencel visit
-   Свободные Слоты для календаря (Time Slots)
    -   [METHOD] Book time slots

## Kontur ma'lumotlar shakli

### Города (Cities)

---

-   Field nomi: `id`
-   Turi: `number`

---

-   Field nomi: `name`
-   Turi: `string`

---

-   Field nomi: `long`
-   Turi: `string`

---

-   Field nomi: `lat`
-   Turi: `string`

---

### Проекты (Projects)

---

-   BT'dagi nomi: `id проекта`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `Название проекта`
-   Field nomi: `name`
-   Turi: `string`

---

-   BT'dagi nomi: `Матрица помещений на этажах`
-   Field nomi: `?`
-   Turi: `?`

---

-   BT'dagi nomi: `Короткое описание проекта`
-   Field nomi: `brief_description`
-   Turi: `string`

---

-   BT'dagi nomi: `Подробное описание проекта`
-   Field nomi: `detailed_description`
-   Turi: `string`

---

-   BT'dagi nomi: `Срок сдачи`
-   Field nomi: `end_date`
-   Turi: `Date`

---

-   BT'dagi nomi: `Фотографии проекта`
-   Field nomi: `photo`
-   Turi: `string`

---

-   BT'dagi nomi: `Ссылка на сайт`
-   Field nomi: `link`
-   Turi: `string`

---

-   BT'dagi nomi: `Описание проекта`
-   Field nomi: `description`
-   Turi: `string`

---

### Здания (Buildings)

---

-   BT'dagi nomi: `id объекта`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `Адрес объекта`
-   Field nomi: `address`
-   Turi: `string`

---

-   BT'dagi nomi: `Количество этажей`
-   Field nomi: `number_of_floors`
-   Turi: `number`

---

-   BT'dagi nomi: `Короткое описание проекта`
-   Field nomi: `brief_description`
-   Turi: `string`

---

-   BT'dagi nomi: `Подробное описание проекта`
-   Field nomi: `detailed_description`
-   Turi: `string`

---

-   BT'dagi nomi: `Количество свободных помещений 1го типа (количество квартир)`
-   Field nomi: `total_apartment`
-   Turi: `string`

---

-   BT'dagi nomi:
    `Количество свободных помещений 2го типа (количество машино-мест)`
-   Field nomi: `total_parking_space`
-   Turi: `string`

---

-   BT'dagi nomi:
    `Количество свободных помещений 3го типа (количество кладовых)`
-   Field nomi: `total_storage`
-   Turi: `string`

---

-   BT'dagi nomi:
    `Количество свободных помещений 4го типа (количество коммерческих помещений)`
-   Field nomi: `total_commercial`
-   Turi: `string`

---

### Помещения (Premises)

---

-   BT'dagi nomi: `id проекта`
-   Field nomi: `---`
-   Turi: `---`

---

-   BT'dagi nomi: `id объекта`
-   Field nomi: `building_id`
-   Turi: `number`

---

-   BT'dagi nomi: `id помещения`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `вид помещения`
-   Field nomi: `type`
-   Turi: `enum`
-   Qiymati:
    -   `apartment`
    -   `storeroom`
    -   `parking`
    -   `commercial`

---

-   BT'dagi nomi: `комнатность`
-   Field nomi: `rooms`
-   Turi: `number`

---

-   BT'dagi nomi: `площадь`
-   Field nomi: `size`
-   Turi: `number`

---

-   BT'dagi nomi: `стоимость`
-   Field nomi: `price`
-   Turi: `bigint`

---

-   BT'dagi nomi: `этаж`
-   Field nomi: `floor`
-   Turi: `number`

---

-   BT'dagi nomi:
    1.  `признак “обмен рф”`
    2.  `признак “окна в пол”`
    3.  `признак “окно в коридоре”`
    4.  `признак “окно в санузле”`
    5.  `признак “без отделки”`
    6.  `признак “двухуровневая”`
    7.  `признак “отдельный вход`
    8.  `признак “свободная планировка”`
    9.  `признак “балкон”`
    10. `признак “летняя кухня на крыше”`
    11. `признак “лоджия”`
    12. `признак “терраса”`
    13. `признак “терраса на кровле”`
    14. `признак “терраса с выходом на крышу”`
    15. `признак “второй санузел”`
    16. `признак “гардероб в спальне”`
    17. `признак “гардеробная”`
    18. `признак “кладовая”`
    19. `признак “постирочная”`
    20. `признак “мастер-спальня”`
    21. `признак “вторичная квартира”`
    22. `признак “наземный паркинг/подземный паркинг”`
-   Field nomi: `feature`
-   Turi: `enum`
-   Qiymati:
    1.  `sign_exchange_rf`
    2.  `sign_floor_to_ceiling`
    3.  `sign_window_in_the_corridor`
    4.  `sign_window_in_the_bathroom`
    5.  `sign_no_finishing`
    6.  `sign_two_level`
    7.  `sign_separate_entrance`
    8.  `sign_open_plan`
    9.  `sign_balcony`
    10. `sign_summer_kitchen_on_the_roof`
    11. `sign_loggia`
    12. `sign_terrace`
    13. `sign_roof_terrace`
    14. `sign_terrace_with_access_to_the_roof`
    15. `sign_second_bathroom`
    16. `sign_dressing_room_in_the_bedroom`
    17. `sign_dressing_room`
    18. `sign_storage_room`
    19. `sign_laundry_room`
    20. `sign_master_bedroom`
    21. `sign_secondary_apartment`
    22. `sign_ground_parking`

---

-   BT'dagi nomi: `фотографии помещения`
-   Field nomi: `photos`
-   Turi: `string[]`

---

-   BT'dagi nomi: `свободно для бронирования`
-   Field nomi: `is_booked`
-   Turi: `boolean`

---

-   BT'dagi nomi: `вариант покупки`
-   Field nomi: `purchase_option`
-   Turi: ``
-   Qiymati:
    -   `mortage`
    -   `installment`
    -   `bill`
    -   `full_payment`

---

-   BT'dagi nomi: `Куплено`
-   Field nomi: `is_sold`
-   Turi: `boolean`

---

### Сделки и статусы (Leads and statuses)

---

-   BT'dagi nomi: `id сделки`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `id клиента`
-   Field nomi: `client_id`
-   Turi: `number`

---

-   BT'dagi nomi: `id помещения`
-   Field nomi: `premise_id`
-   Turi: `number`

---

-   BT'dagi nomi: `статус сделки`
-   Field nomi: `state`
-   Turi: `enum`
-   Qiymati:
    -   `Активные`
    -   `На паузе`
    -   `Проиграна`
    -   `Выиграна`

---

-   BT'dagi nomi: `этап сделки`
-   Field nomi: `current_status`
-   Turi: `enum`
-   Qiymati:
    -   `открыта`
    -   `интерес к покупке`
    -   `презентация`
    -   `бронь`
    -   `заявка на договор`
    -   `договор зарегистрирован`
    -   `выиграна`
    -   `отмененная бронь`
    -   `слетевшая бронь`
    -   `на паузе`
    -   `проверка лида`
    -   `проиграна`

---

-   BT'dagi nomi: `признак “пройден NPS”`
-   Field nomi: `sign_nps_passed`
-   Turi: `boolean`

---

-   BT'dagi nomi: `вознаграждение по сделке`
-   Field nomi: `fee`
-   Turi: `number`

---

-   BT'dagi nomi: `дата старта сделки`
-   Field nomi: `start_date`
-   Turi: `date`

---

-   BT'dagi nomi: `Дата последнего изменения этапа `
-   Field nomi: `status_updated_at`
-   Turi: `date`

---

-   BT'dagi nomi: `id агента`
-   Field nomi: `agent_id`
-   Turi: `number`

---

-   BT'dagi nomi: `id менеджера`
-   Field nomi: `manager_id`
-   Turi: `number`

---

### Свободные Слоты для календаря (Time Slots)

---

### Пользователи (Users)

---

-   BT'dagi nomi: `id пользователя`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `Фамилия пользователя`
-   Field nomi: `lastName`
-   Turi: `string`

---

-   BT'dagi nomi: `Имя пользователя`
-   Field nomi: `firstName`
-   Turi: `string`

---

-   BT'dagi nomi: `Отчество пользователя`
-   Field nomi: `---`
-   Turi: `---`

---

-   BT'dagi nomi: `Телефон пользователя`
-   Field nomi: `phone`
-   Turi: `string`

---

-   BT'dagi nomi: `email пользователя`
-   Field nomi: `email`
-   Turi: `string`

---

-   BT'dagi nomi: `Статус пользователя`
-   Field nomi: `status`
-   Turi: `enum`
-   Qiymati:
    -   `active`
    -   `blocked`

---

-   BT'dagi nomi: `Роль пользователя`
-   Field nomi: `role`
-   Turi: `enum`
-   Qiymati:
    -   `ADMIN`
    -   `AGENT`
    -   `MANAGER`
    -   `NEW_MEMBER`
    -   `HEAD_OF_AGENCY`
    -   `OZK_MANAGER`
    -   `AFFILIATE_MANAGER`

---

-   BT'dagi nomi: `Признак заявки на изменение роли`
-   Field nomi: `temporary_role`
-   Turi: `enum`
-   Qiymati:
    -   `ADMIN`
    -   `AGENT`
    -   `MANAGER`
    -   `NEW_MEMBER`
    -   `HEAD_OF_AGENCY`
    -   `OZK_MANAGER`
    -   `AFFILIATE_MANAGER`

---

-   BT'dagi nomi: `Город пользователя`
-   Field nomi: `city_id`
-   Turi: `number`

---

-   BT'dagi nomi: `Дата рождения пользователя`
-   Field nomi: `birthDate`
-   Turi: `date`

---

-   BT'dagi nomi: `id Агентство недвижимости пользователя`
-   Field nomi: `agency_id`
-   Turi: `number`

---

-   BT'dagi nomi: `Дата начала работы в АН пользователя`
-   Field nomi: `workStartDate`
-   Turi: `date`

---

-   BT'dagi nomi: `Фото пользователя`
-   Field nomi: `avatar`
-   Turi: `string`

---

-   BT'dagi nomi: `Количество оставшихся бронирований`
-   Field nomi: `remaining_user_creation_limit`
-   Turi: `number`

---

### Агентства (Agencies)

---

-   BT'dagi nomi: `id Агентство недвижимости`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `Название агентства недвижимости`
-   Field nomi: `title`
-   Turi: `string`

---

-   BT'dagi nomi: `Основной город работы агентства`
-   Field nomi: `city_id`
-   Turi: `number`

---

-   BT'dagi nomi: `Юридическое название компании`
-   Field nomi: `legalName`
-   Turi: `string`

---

-   BT'dagi nomi: `ИНН АН`
-   Field nomi: `inn`
-   Turi: `string`

---

-   BT'dagi nomi: `Телефон АН`
-   Field nomi: `phone`
-   Turi: `string`

---

-   BT'dagi nomi: `email АН`
-   Field nomi: `email`
-   Turi: `string`

---

-   BT'dagi nomi: `ФИО контактного лица от агентства недвижимости`
-   Field nomi: `ownerFullName`
-   Turi: `string`

---

-   BT'dagi nomi: `Телефон контактного лица от агентства недвижимости`
-   Field nomi: `ownerPhone`
-   Turi: `string`

---

### Клиенты (Clients)

---

-   BT'dagi nomi: `id клиента`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `Фамилия клиента`
-   Field nomi: `fullname`
-   Turi: `string`

---

-   BT'dagi nomi: `Имя клиента`
-   Field nomi: `fullname`
-   Turi: `string`

---

-   BT'dagi nomi: `Отчество клиента`
-   Field nomi: `fullname`
-   Turi: `string`

---

-   BT'dagi nomi: `Телефон клиента`
-   Field nomi: `phone_number`
-   Turi: `string`

---

-   BT'dagi nomi: `Комментарий по сделке клиента`
-   Field nomi: `comment`
-   Turi: `string`

---

-   BT'dagi nomi: `Дата заведения клиента`
-   Field nomi: `actived_date`
-   Turi: `date (timestamp)`

---

-   BT'dagi nomi: `Последняя дата закрепления клиента`
-   Field nomi: `fixing_type_updated_at`
-   Turi: `date (timestamp)`

---

-   BT'dagi nomi: `Дата окончания последнего закрепления клиента`
-   Field nomi: `expiration_date`
-   Turi: `date (timestamp)`

---

-   BT'dagi nomi: `Статус закрепления`
-   Field nomi: `fixing_type`
-   Turi: `enum`
-   Qiymati:
    -   `проверка лида`
    -   `отказ в закреплении`
    -   `слабое закрепление`
    -   `сильное закрепление`

---

-   BT'dagi nomi: `id агента закрепленного за клиентом`
-   Field nomi: `agent_id`
-   Turi: `number`

---

-   BT'dagi nomi: `Тип закрепления клиента`
-   Field nomi: `fixing_type`
-   Turi: `enum`
-   Qiymati:
    -   `проверка лида`
    -   `отказ в закреплении`
    -   `слабое закрепление`
    -   `сильное закрепление`

---

-   BT'dagi nomi: `id сделок по клиенту`
-   Field nomi: `---`
-   Turi: `---`

---

-   BT'dagi nomi: `наличие задач менеджера по клиенту`
-   Field nomi: `---`
-   Turi: `---`

---

### Бронирование (Bookings)

---

-   BT'dagi nomi: `id бронирования`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `id помещения`
-   Field nomi: `premise_id`
-   Turi: `number`

---

-   BT'dagi nomi: `id клиента`
-   Field nomi: `client_id`
-   Turi: `number`

---

-   BT'dagi nomi: `id агента`
-   Field nomi: `agent_id`
-   Turi: `number`

---

-   BT'dagi nomi: `дата бронирования`
-   Field nomi: `date`
-   Turi: `date ("YYYY-MM-DD")`

---

-   BT'dagi nomi: `время бронирования`
-   Field nomi: `time`
-   Turi: `"HH:mm"`

---

-   BT'dagi nomi: `вариант покупки`
-   Field nomi: `purchase_option`
-   Turi: `enum`
-   Qiymati:
    -   `mortage`
    -   `installment`
    -   `bill`
    -   `full_payment`

---

-   BT'dagi nomi: `статус бронирования`
-   Field nomi: `status`
-   Turi: `enum`
-   Qiymati:
    -   `open`
    -   `success`
    -   `fail`

---

### Показы (Visits)

---

-   BT'dagi nomi: `id показа`
-   Field nomi: `id`
-   Turi: `number`

---

-   BT'dagi nomi: `id проекта`
-   Field nomi: `project_id`
-   Turi: `number`

---

-   BT'dagi nomi: `id агента`
-   Field nomi: `agent_id`
-   Turi: `number`

---

-   BT'dagi nomi: `id клиента`
-   Field nomi: `client_id`
-   Turi: `number`

---

-   BT'dagi nomi: `дата показа`
-   Field nomi: `date`
-   Turi: `date ("YYYY-MM-DD")`

---

-   BT'dagi nomi: `время показа`
-   Field nomi: `time`
-   Turi: `"HH:mm"`

---

-   BT'dagi nomi: `дата формирования заявки на показ`
-   Field nomi: `request_date`
-   Turi: `date (timestamp)`

---

-   BT'dagi nomi: `время формирования заявки на показ`
-   Field nomi: `request_time`
-   Turi: `date (timestamp)`

---

-   BT'dagi nomi: `статус заявки на показ`
-   Field nomi: `status`
-   Turi: `enum`
-   Qiymati:
    -   `open`
    -   `success`
    -   `fail`

---
