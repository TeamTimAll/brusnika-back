# TODO

## Code baza
- [x] Project config'larini validation qilib config abstraction'dan olinishi kerak. Hozirda `proccess.env`'dan olinyapti. Config oqimini shakilantirish. ORM'da 2 ta config yozilgan. Sync bo'lishi izdan chiqadi.
- [x] code format qo'shish?
- [ ] unit testing?
- [ ] Seed qo'shish (logika jihatdan kelib chiqib)?
- [ ] Base service? Qayta takrorlanadigan CRUD'ni base service'ga olib o'tish. Yangi module qo'shish tezligini oshiradi, DRY'ni oldini oladi.
- [x] auth service'da ok response'da `HttpException` ishlatilgan. Response abstraction kerak. Chunki `HttpException` Error'dan extend olgan. Bu degani `HttpException` tashalganda stack trace bilan chiqadi degani. Logger'da kelishmovchiliklar bo'ladi. Misol uchun info'ni ichida stack trace string keladi va bu debug qilishni qiyinlashtirib yuboradi.
- [x] Error qolibi. Error code va message'larni bilan. Tillik yoki 1 ta tillik.
- [ ] Logger. Error qolibi qilinsa logger implement qilish oson kechadi. Logger daraxt ko'rinishida shakilantirish ixtiyoriy.
- [ ] File saqlashda jildlarga ajaratib ishlash. Bu file boshqaruvni osonlashtiradi. Tashqaridan tool ishlatish file bilan bo'ladigan amallarni tezlashtiradi. Tool'ga misol `MinIO`. Hozirda file saqlanish `media` nomli jildda saqlanyapti. File boshqaruv ixtiyoriy.
- [ ] CI/CD. Development tezligini oshiradi.
- [ ] Environment shakli. Misol: `main` (shuncha project haqida ma'lumot. ixtiyoriy), `prod`, `test`, `dev`.
- [x] Code bazadan ishlatilmaydigan keraksiz code va config'larni o'chirib tashlash.

## Database
- [ ] Клиенты - [Client](src/modules/client/)
- [ ] Сделки - [Deals](src/modules/deals/)
- [ ] Агент - [News](src/modules/agencies/)
- [ ] Проекты - [Projects](src/modules/projects/)
- [ ] Чат с поддержкой ? - [Commnets](src/modules/comments/)
- [ ] Задачи - ?
- [ ] Обмен - ?
- [ ] ? - [Deals](src/modules/events/)
- [ ] ? - [Training](src/modules/training/)
- [ ] ? - [Cities](src/modules/news/)

Arenda logikaning hisobotsiz shakli.

- [ ] Client module'ni ko'rib chiqish kerak.
- [ ] Client filter'ida active/hamma (default active) bo'yicha ma'lumot olinadi. 
    Lekin lead'dagi status "на паузе" yoki "проиграна" bo'lmasligi kerak.
- [ ] Client entity ma'lumotlari:
    - F.I.SH
    - Telfon raqam
    - Project
    - Actived_date[from | to] (Дата первичного заведения “от” и “до”)
    - Current status.
    - Comment
    - Tags
    - Expiration date
    - Task node
