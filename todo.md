# TODO

## Code baza
- [x] Project config'larini validation qilib config abstraction'dan olinishi kerak. Hozirda `proccess.env`'dan olinyapti. Config oqimini shakilantirish. ORM'da 2 ta config yozilgan. Sync bo'lishi izdan chiqadi.
- [x] code format qo'shish?
- [x] unit testing?
- [x] Seed qo'shish (logika jihatdan kelib chiqib)?
- [ ] Base service? Qayta takrorlanadigan CRUD'ni base service'ga olib o'tish. Yangi module qo'shish tezligini oshiradi, DRY'ni oldini oladi.
- [x] auth service'da ok response'da `HttpException` ishlatilgan. Response abstraction kerak. Chunki `HttpException` Error'dan extend olgan. Bu degani `HttpException` tashalganda stack trace bilan chiqadi degani. Logger'da kelishmovchiliklar bo'ladi. Misol uchun info'ni ichida stack trace string keladi va bu debug qilishni qiyinlashtirib yuboradi.
- [x] Error qolibi. Error code va message'larni bilan. Tillik yoki 1 ta tillik.
- [-] Logger. Error qolibi qilinsa logger implement qilish oson kechadi. Logger daraxt ko'rinishida shakilantirish ixtiyoriy.
- [-] File saqlashda jildlarga ajaratib ishlash. Bu file boshqaruvni osonlashtiradi. Tashqaridan tool ishlatish file bilan bo'ladigan amallarni tezlashtiradi. Tool'ga misol `MinIO`. Hozirda file saqlanish `media` nomli jildda saqlanyapti. File boshqaruv ixtiyoriy.
- [-] CI/CD. Development tezligini oshiradi.
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
- [x] premise price field chiqarish kerak.

### Client
- [x] Lead state bo'yicha filter qilish.
- [x] filter'ni read all bilan 1 ta qilish
- [x] pagination kerak.
- [x] Client fullname va phone bo'yicha quick search.
- [x] Client fullname bilan emas id'si bilan filter qilish.
- [x] Read All'da client id qo'shish kerak.
- [x] Client ma'lumotlari auth bilan olinishi kerak. 
- [x] phone va fullname birgalikda quick search.
- [x] lead'larini ham qo'shib berish kerak. Project'ni ham qo'shish kerak. LeadOps qo'shish kerak emas.
- [ ] "Проверить закрепление" da BPMSoft'ga ma'lumot jo'natish mock data bilan.
- [x] agent bo'yicha olish. Agar status'i weak bo'ladigan bo'lsa hammaga ko'rsatish.
    - [x] search'ga ham qo'shish.
- [x] LeadState(active | on_pause | failed | success) bo'yicha client filter.
- [x] Client mock data qo'shib berish.

### Premises
- [ ] подъезд qo'shish kerak emasmi?
- [x] bron qilinmagan premise'larni chiqarish.
- [x] bron qilinganligi haqida ma'lumot kerak. `is_booked` ga o'xshagan
- [ ] city bo'yicha filter.

### Agent
- [ ] Agent gruhga qo'sha olish va olib tashlash

### Booking
- [ ] Nega create qilinganda project va building olinmayapti.

### Project
- [x] agent login/settings'dan tanlagan shahari bo'yicha project'larni ko'ra olishi kerak.
- [ ] ~~filter city bo'yicha?~~
    City:
        Москва
        Тюмень
        Новосибирск
        Екатеринбург
        Сургут
        Курган
        Омск

### News
- [ ] BT bilan ma'mulmotlarini to'g'irlash kerak.

### Events
- [ ] BT bilan ma'mulmotlarini to'g'irlash kerak.

### Trainning
- [ ] BT bilan ma'mulmotlarini to'g'irlash kerak.

### Calendar
- [ ] ~~manager entity bilan bog'liqlik.~~
- [ ] mock'da qo'shib berish
- [X] visits'ni premise'dan project'ga almashtirish.
- [x] visits'da project, client, agent  ma'lumotlari kerak. 
    project
        - id
        - name
        - location
    client
        - id
        - name
        - phone
    manager
        - id
        - name
        - phone

# Users
- [x] admin role ochish.
- [x] hamma role uchun seed yozish.

# Error handling
- [x] prompt'dagi label'ni arraydan ```{ ru: "", uz: "", en: "" }``` ga o'tkazish
- [x] token almashganda 500 error beryapti.

- [x] Проверить закрепления qilish kerak. Client'ni BPMSoft'dan tekshirish kerak. Client ismi va telefon raqami orqali qidiriladi. BPMSoft'ga Agent fullname va phone number jo'natiladi.
    Note: BPMSoft'ga ulanmagan.
- [x] Отмена показ килиш керак,
- [x] Weakly calendar. Calendarni hafta kunlariga chiqarish kerak. date beriladi. Shu date'dan hafta boshi va oxirgi kuni topiladi. Ma'lumot shu date'lar bilan qirqiladi. Hafta boshlanish nuqtasi tanlanishi kerak. Date range yoki 7 kunlik qilib chiqarish imkoniyatini chiqarish kerak.
- [x] not-booked-premises API bo'sh array qaytaryapti.
- [x] event read all va city bo'yicha filter
- [x] event'da dto ichida ko'p ma'lumotlar chiqarilmagan
- [x] keycloak uchun mini-tiny server qilish.
- [x] ma'lumot heshlash algaritmi. 
- [x] user role'larni qo'shib berish.

### 2024-07-22
- [x] Contact entity qo'shish kerak va events bilan bog'liqlik kerak.
- [x] Event'ga ```is_banner``` qo'shish kerak.
- [x] Event update'da contact ham update bo'lishi kerak.
- [x] Calendar'da events entity'ga e_ prefix qo'shilyapti. Shuni olib tashlash kerak.
- [x] Calendar'da project photo'si kerak.
- [x] News get one'da raw entity qaytarilgan. To'g'irlash kerak.

### 2024-07-23
- [x] Events'da views va likes count field'lar kerak.
- [x] Events'da kun bo'yicha filter kerak.
- [x] Events'ga ```is_draft``` field qo'shib berish kerak.
- [x] Events'ga like bosganda like count ko'payishi kerak. Dislike and like
- [x] Events'ga userlarni ham biriktirish kerak. User'ga taklif yuboriladi. Userlarni biriktirish bluk import shaklida bo'lishi kerak.
- [ ] User taklifni qabul qilishi yoki rad etishi mumkin.
- [ ] Events'ga tag qo'shish kerak.
- [ ] Event'ga user'larni birikishni olib tashlash imkoniyati.
- [ ] Event'ga user o'zi ham register qila oladi.
- [ ] Event'da accept qilganlarni count'ni chiqarish.
- [ ] Event'da agar max_visitors sonidan tashqari yana invite qilmoqchi bo'lsa error chiqarish.
- [ ] Front dev uchun domain ulash. URI: https://dev-dashboard-brusnika.teamtim.tech
- [ ] Kontur server uchun ping qilish uchun API.
