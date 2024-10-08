# Integration of Kontur and Brusnika

Brusnika va kontur integratsiyasi `Kafka` va `Rest API` orqali amalga
oshiriladi.

## Integratsiya qilinadigan ma'lumotlar

1. Brusnika'dan Kontur'ga kiruvchi ma'lumotlar:

-   Города (Cities)
-   Проекты (Projects)
-   Здания (Buildings)
-   Разделы (Sections)
-   Помещения (Premises)
-   Сделки и статусы (Leads and statuses)
-   Свободные Слоты для календаря (Time Slots)

2. Kontur'dan Brusnika'ga beruvchi ma'lumotlar:

-   Пользователи (Users)
-   Агентства (Agencies)
-   Клиенты (Clients)
-   Бронирование (Bookings)
-   Показы (Visits)
-   Свободные Слоты для календаря (Time Slots)

## Kontur Brusnika'dan qabul qilishi kerak bo'lgan ma'lumotlar shakli

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

-   BT'dagi nomi: `Название помещений 1го типа`
-   Field nomi: `apartment`
-   Turi: `string`

---

-   BT'dagi nomi: `Название помещений 2го типа`
-   Field nomi: `parking`
-   Turi: `string`

---

-   BT'dagi nomi: `Название помещений 3го типа`
-   Field nomi: `storeroom`
-   Turi: `string`

---

-   BT'dagi nomi: `Название помещений 4го типа`
-   Field nomi: `commercial`
-   Turi: `string`

---
