# TODO

## Code baza
- [x] Project config'larini validation qilib config abstraction'dan olinishi kerak. Hozirda `proccess.env`'dan olinyapti. Config oqimini shakilantirish. ORM'da 2 ta config yozilgan. Sync bo'lishi izdan chiqadi.
- [x] code format qo'shish?
- [x] unit testing?
- [ ] Seed qo'shish (logika jihatdan kelib chiqib)?
- [ ] Base service? Qayta takrorlanadigan CRUD'ni base service'ga olib o'tish. Yangi module qo'shish tezligini oshiradi, DRY'ni oldini oladi.
- [x] auth service'da ok response'da `HttpException` ishlatilgan. Response abstraction kerak. Chunki `HttpException` Error'dan extend olgan. Bu degani `HttpException` tashalganda stack trace bilan chiqadi degani. Logger'da kelishmovchiliklar bo'ladi. Misol uchun info'ni ichida stack trace string keladi va bu debug qilishni qiyinlashtirib yuboradi.
- [x] Error qolibi. Error code va message'larni bilan. Tillik yoki 1 ta tillik.
- [ ] Logger. Error qolibi qilinsa logger implement qilish oson kechadi. Logger daraxt ko'rinishida shakilantirish ixtiyoriy.
- [ ] File saqlashda jildlarga ajaratib ishlash. Bu file boshqaruvni osonlashtiradi. Tashqaridan tool ishlatish file bilan bo'ladigan amallarni tezlashtiradi. Tool'ga misol `MinIO`. Hozirda file saqlanish `media` nomli jildda saqlanyapti. File boshqaruv ixtiyoriy.
- [ ] CI/CD. Development tezligini oshiradi.
- [x] Environment shakli. Misol: `main` (shuncha project haqida ma'lumot. ixtiyoriy), `prod`, `test`, `dev`.
- [x] Code bazadan ishlatilmaydigan keraksiz code va config'larni o'chirib tashlash.

---
### Client
- [x] Client module'ni ko'rib chiqish kerak.
- [x] Client filter'ida active/hamma (default active) bo'yicha ma'lumot olinadi. 
    Lekin lead'dagi status "на паузе" yoki "проиграна" bo'lmasligi kerak.
    - [x] Filter field `fullname`
    - [x] Filter field `phone_number`
    - [x] Filter field `project_id`
    - [x] Filter field `actived_from_date`
    - [x] Filter field `actived_to_date`
    - [x] Filter field `status`
- [x] Client entity ma'lumotlari:
    - [x] F.I.SH
    - [x] Telfon raqam
    - [x] Project
    - [x] Actived_date[from | to] (Дата первичного заведения “от” и “до”)
    - [x] Current status.
    - [x] Comment
    - [x] Tags
    - [x] Expiration date
    - [x] Task node (About client)

### Lead
- [x] current status field qo'shish.
- [x] created at bo'yicha asc va desc sort
- [x] lead number
- [x] lead'ning hozirgi turgan status'i bo'yicha filter qilish.
    Muamo: `TypeOrm`'ning `where` API'sidan foydalanganda, `lead_ops` ma'lumotlarini filter qilyapti. Lekin lead'ning ma'lumotlari filter qilinishi kerak.
- [x] premises type lead read all'da
- [x] filter'ni read all bilan 1 ta qilish
- [x] pagination kerak.

### Clinet
- [x] Lead state bo'yicha filter qilish.
- [x] filter'ni read all bilan 1 ta qilish
- [x] pagination kerak.
- [x] Client fullname va phone bo'yicha quick search.
- [x] Client fullname bilan emas id'si bilan filter qilish.

### Premises
- [ ] подъезд qo'shish kerak emasmi?

### Agent
- [ ] Agent gruhga qo'sha olish va olib tashlash
