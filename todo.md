# TODO

## Code baza
- [x] Project config'larini validation qilib config abstraction'dan olinishi kerak. Hozirda `proccess.env`'dan olinyapti. Config oqimini shakilantirish. ORM'da 2 ta config yozilgan. Sync bo'lishi izdan chiqadi.
- [x] code format qo'shish?
- [x] unit testing?
- [x] Seed qo'shish (logika jihatdan kelib chiqib)?
- [-] Base service? Qayta takrorlanadigan CRUD'ni base service'ga olib o'tish. Yangi module qo'shish tezligini oshiradi, DRY'ni oldini oladi.
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
    - [x] I S
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
- [x] city bo'yicha filter.

### Agent
- [ ] Agent gruhga qo'sha olish va olib tashlash

### Booking
- [ ] Nega create qilinganda project va building olinmayapti.

### Project
- [x] agent login/settings'dan tanlagan shahari bo'yicha project'larni ko'ra olishi kerak.
- [x] ~~filter city bo'yicha?~~
    City:
        Москва
        Тюмень
        Новосибирск
        Екатеринбург
        Сургут
        Курган
        Омск

### News
- [x] BT bilan ma'mulmotlarini to'g'irlash kerak.

### Events
- [x] BT bilan ma'mulmotlarini to'g'irlash kerak.

### Trainning
- [x] BT bilan ma'mulmotlarini to'g'irlash kerak.

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

### 2024-07-24
- [x] User taklifni qabul qilishi yoki rad etishi mumkin.
- [x] Event'ga user'larni birikishni olib tashlash imkoniyati.
- [x] Event'ga user o'zi ham register qila oladi.
- [x] Event'da agar max_visitors sonidan tashqari yana invite qilmoqchi bo'lsa error chiqarish.
- [x] Front dev uchun domain ulash. URI: https://dev-dashboard-brusnika.teamtim.tech
- [x] Event'da accept qilganlarni count'ni chiqarish.
- [x] My events api kerak.
- [x] Event'ni read all qilganida is_draft true'larni chiqarmaslik.
    - [x] Calendar'da ham.
    - [x] User'ga nisbattan olish kerak. Yani faqat Admin draft'larni ko'ra oladi.
- [x] Event'da is_banner bilan query.

### 2024-07-25
- [x] Event'ga agency user'larni biriktirish. Agency id beriladi. Agar berilgan agency'da userlar soni event max_visitors sonidan ko'p bo'lsa error chiqarish kerak.
- [x] Events'ni read all qilishda feature yoki all query beriladi. default feature bo'ladi. feature'da kelajakda rejalashtirilayotgan eventlar beriladi. all'da esa hammasi.
- [x] Event'ga role bilan yasashi va invite qilishi. Ruxsat **админ**, **партнерский менеджер** role'larga beriladi.
- [x] Event pagination.
- [x] Events'ga tag qo'shish kerak.
- [x] User'lar listini chiqarish kerak. Faqat **админ** va **партнерский менеджер** role olishi kerak.
- [x] Calendar'da news'ni olib tashlash kerak.

### 2024-07-26
- [x] Calendar'da user o'z eventini ko'rishi kerak va o'zi yasagan event'larni ham ko'rishi kerak.
- [x] Event contact update qilish.
- [x] Event time da "HH:MM" formatda kiryapti, database'dan esa "HH:MM:SS" chiqyapti shuni "HH:MM"ga o'tkazish kerak.
- [x] Calendar'da user o'z visit'larni ko'rishi kerak.
- [x] Calendar'da berilgan sananing oyi bo'yicha ma'lumot chiqarish kerak.

### 2024-07-29
- [x] Telefon raqam user'da unique bo'lishi kerak.
- [x] BaseService ni o'chirib tashlash. Yani API qolibini bir xil ko'rinishga keltirish.
    - [x] Agencies Service
        - [x] API [GET]:    /agencies
        - [x] API [GET]:    /agencies/:id
        - [x] API [POST]:   /agencies
        - [x] API [PUT]:    /agencies/:id
        - [x] API [DELETE]: /agencies/:id
    - [x] Bookings Service
        - [x] API [GET]:    /bookings
        - [x] API [GET]:    /bookings/:id
        - [x] API [POST]:   /bookings
        - [x] API [PUT]:    /bookings/:id
        - [x] API [DELETE]: /bookings/:id
    - [x] Buildings Service
        - [x] API [GET]:    /buildings
        - [x] API [GET]:    /buildings/:id
        - [x] API [POST]:   /buildings
        - [x] API [PUT]:    /buildings/:id
        - [x] API [DELETE]: /buildings/:id
    - [x] Cities Service
        - [x] API [GET]:    /cities
        - [x] API [GET]:    /cities/:id
        - [x] API [POST]:   /cities
        - [x] API [PUT]:    /cities/:id
        - [x] API [DELETE]: /cities/:id
    - [x] Categories Service
    - [x] Likes Service
    - [x] Views Service
    - [x] Trainings Service
        - [x] API [GET]:    /trainings
        - [x] API [GET]:    /trainings/:id
        - [x] API [POST]:   /trainings
        - [x] API [PUT]:    /trainings/:id
        - [x] API [DELETE]: /trainings/:id
    - [x] News Service
        - [x] API [GET]:    /news
        - [x] API [GET]:    /news/:id
        - [x] API [POST]:   /news
        - [x] API [PUT]:    /news/:id
        - [x] API [DELETE]: /news/:id
    - [x] Premises Service
    - [x] Sections Service
- [x] Interceptors dan foydalangan holda meta data kirishini abstraction qilish. URL: https://docs.nestjs.com/interceptors

---

- [x] User email'ni update qilganda verify qilishi kerak.
- [x] Kontur server uchun ping qilish uchun API.
- [x] Event read one'da user invatition bilan chiqishi kerak. User'ning fullname, photo, agency.
- [x] Event read'da is_liked field qo'shib berish.
- [x] Event read'da is_joind field qo'shib berish.
- [x] Event pagination xato ishlayapti.
- [x] Booking'da 5 tadan ortiq create qila olmasin.
- [x] Event invatition'ni accept qilish uchun API.

### 2024-08-05
- [x] User Event'dan chiqib keta olishi uchun API.
- [x] Event banner uchun alohida API.
- [x] News banner uchun alohida API.
- [x] Toggle Like'da id event_id'ga o'zgartirildi.
- [x] Toggle draft qo'shib berish.

### 2024-08-06
- [x] User o'z agency'sini o'zgartira olishi kerak. API: /users/agency
- [x] User listi uchun filter
    - F.I.SH
    - Shahar
    - Role
    - Register qilgan kuni
    - Agency nomi bilan
- [x] User event'ni accept/cencel qilganida is_read'ni true'ga o'zgartirish.
- [x] Booking create qila olish limitini ko'rsatuvchi meta data.
- [x] User list'i uchun agency qo'shib berish kerak.

- [x] O'ziga tegishli bo'lgan notification'larni olish kerak.
- [x] Agar event'ni accept qilmasa event notification delete qilish kerak.
- [ ] User register qilganda CRM'ga so'rov yuboradi. User status'i register'ga o'tkazib qo'yish kerak. Javob kelganidan keyin User status'i CRM'dan berilgan status bilan update qilishi kerak. CRM'dan o'chirib tashlansa block status'iga o'tkazib qo'yish kerak.

## Admin role va role model

### HEAD_OF_AGENCY (Руководитель агентства)
- [x] User'larni listni ko'ra oladi. User id bilan ham oladi.
- [x] NEW_MEMBER role'idagi user'larni agent role'iga o'tkaza oladi. Agent'larni block ham qila oladi. NEW_MEMBER'dan AGENT'ga o'tkaza oladi.

### AFFILIATE_MANAGER (Партнерский менеджер)
- [x] NEW_MEMBER role'idagi user'larni agent role'iga o'tkaza oladi. Agent'larni block ham qila oladi. NEW_MEMBER'dan AGENT va HEAD_OF_AGENCY'ga o'tkaza oladi. HEAD_OF_AGENCY'dan AGENT role'iga ham o'tkaza oladi.
- [x] User'larni listni ko'ra oladi. User id bilan ham oladi.
- [x] User role'larni o'zgartira oladi.
- [x] Premise reklamasini generatsiya qila oladi.
- [x] Training create qila oladi.
- [x] Training update qila oladi.
- [x] News create qila oladi.
- [x] Event create qila oladi.
- [x] Contact'larni boshqaruvini qila oladi.
- [x] Project'larni boshqaruvini qila oladi.

### ADMIN (Администратор)
- [x] Premise link create qila oladi.
- [x] Xohlagan user nomidan login qila olish imkoniyati.
- [x] OnBoarding module'ini o'chirishi yoki yoqishi mumkin.
- [x] Yangi xodimlar uchun bortga kirish ma'lumotlarini ko'rsatish muddatini belgilash (platformaga birinchi kirgan paytdan boshlab kunlar sonini ko'rsatuvchi joydagi).
- [x] Kalendar oyi davomida mumkin bo'lgan bron qilish sonini belgilash.
- [x] Lead'larni cancel qilinganligi sabablarini ko'ra olishi kerak.
- [x] User'ni role'ini o'zgartira oladi. ADMIN, AFFILIATE_MANAGER. Hamma user'ni block yoki unblock qila oladi.

### Kounter server
Brusnika API'dan olish kerak bo'lgan ma'lumotlar:
- Project [https://erp-core.staging.brusnika.tech/parameters/v1/versions/fc5dbda9-fee2-4cf1-88d9-e8571683f5a8/construction-projects]
- Building []
- Section [https://erp-core.staging.brusnika.tech/parameters/v1/sections]
- Premise [https://erp-core.staging.brusnika.tech/parameters/v1/premise]
- Contact [https://clients-base.staging.brusnika.tech/v1/contact]
- Lead [https://crm.brusnika.ru/crm/hs/bpm/deals]
    - Lead Task: [https://crm.brusnika.ru/crm/hs/bpm/deal-tasks]
- Task
- Time Slots [https://crm.brusnika.ru/crm/hs/ofo/FreeTime]
- User
    - Register
    - Create
- Client
- Bron
- Agency

Brusnika API'lari
- Contact API: [https://clients-base.staging.brusnika.tech/v1/contact]
- Lead API: [https://crm.brusnika.ru/crm/hs/bpm/deals]
- Lead Task API: [https://crm.brusnika.ru/crm/hs/bpm/deal-tasks]

### Premise bitish mudati, yilning fasllari

Premise'lar bitish vaqi yilning fasllariga bo'linadi. Fasllar ma'lumot shakilda saqlaniladi. Brusnika server'ga premise ma'lumotlarini berganida bitish mudati sana ko'rinishda keladi va fasl yasalmagan bo'lsa yasalib yoki boriga bog'lanib saqlaniladi. Frontend uchun filter alohida api qilib berish. Filterni olishda feature yoki old beriladi. Feature da faqat kelajakdagi fasllar, old esa o'tib ketgan fasllar beriladi.
Fasllar entity shakli:
```json
{
    "id": 1,
    "season_name": "1",
    "year": "2024",
    "date": "2024-08-09"
}
```

- [x] User block qilingandan keyin platformaga kira olmasin.
- [x] User sort fullname, agency_name, role, city_name, status, registered_at
- [x] User status active, bloked, registered
- [x] User status update'ga qo'shish.

- [x] Yangi qo'shilgan NEW_MEMBER role'dagi user'larni sanog'ini chiqarish.
    - [x] HEAD_OF_AGENCY role'da o'z agency'sidagilarni sanog'ini chiqarish.
    - [x] ADMIN role'da hammasini sanog'ini chiqarish.
- [x] Training category'larini olayotganda training'larini ham qo'shib berish.
- [x] User status active va blocked dan iborat
- [x] Training role'lar ruhsati uchun field qo'shib berish kerak.
- [x] Hamma shahar uchun premise'lar yasash. Studia ham kerak.
- [x] User verification uchun is_verified va kirmoqchi bo'lgan role'ni saqlash kerak. verification'dan o'tsa so'ralgan role'iga o'tkazib qo'yish kerak.

- [x] Client Lead'ga premise object qo'shib berish.

- [x] Contact'lar CRUD
- [x] User role'ni olib tashlash kerak.
- [x] Training'ga access user object qo'shib berish kerak.
- [x] Training categories da is_active false larni olib beruvchi api
- [x] Training, category Update da set'ga solish kerak.
- [x] Contact'da city bo'yicha filter

- [x] Contact'da telefon raqam array'ga o'tkazish kerak.
- [x] Premise'ga schema field va quyosh tushish burchaki qo'shish kerak.

- [x] push notification sending integration
- [x] check from when it should be send. (for event for sure and for visit maybe if so integate it please)
- [x] Global search hamma entitylar bo'yicha.
    - klient
    - proekt
    - obyekt
- [x] Global search hamma entitylar bo'yicha alohida pagination.

# Clinet 

Client yasash tartibi quyidagicha bo'ladi, Clinet frontend'dan yasaladi va fixing_type'i LEAD_VERIFICATION'ga o'tkaziladi. CRM'dan javob kelsa WEAK_FIXING ga o'tkaziladi. Client'ni ham bir agent o'zi yasaganlarini ko'ra oladi. Agency boshlig'i esa butun agency bo'yicha ko'ra oladi. Admin hammasini ko'ra oladi. Client bor yoki yo'qligini tekshirish imkoniyati mavjud. Tekshirilganda client mavjud bo'lmasa yangi yasay olishi kerak.

- [x] Event yasalayotganda push_notification field qo'shish. Bu field agar is_draft true bo'lsa o'z kuchini yo'qotadi. Notification faqat Event'ning city'siga tegishli bo'lgan user'larga yuborilishi kerak. HEAD_OF_AGENCY va AGENT'larga yuborish kerak.
- [x] Kalendarni oyga bo'lib olish.
- [x] Event'ga 2 soat qolganida, event ishtirokchilariga ogohlantirish uchun notification yuborish kerak.

# NEWS
- [x] Primary va Secondary bir xil bo'lishi kerak emas
- [x] is_draft qo'shish kerak. vazifasi is_draft bo'lsa UIda ko'rinishi kerak emas
- [x] city qo'shishim kerak. faqat userni citysi bo'yicha chiqish kerak yoki hammaga. Access uchun

# Agent uchun analitika

Agent client, lead uchun analitika mavjud.
Agent butun analitikasini oy bo'yicha yoki bir sanadan ikkichi sangacha kesib olishi mumkin.

Analitika uchun raqamlar:
- hamma entity yasalish soni.
    agent yasay oladigan entity'larni yasalishini sanog'i
- yasalgan client'lar sanog'i
- "выиграна" status'iga o'tgan lead'lar soni.
- "выиграна" status'iga o'tgan lead'lar o'rtacha summasi.
    hamma lead'lar summasi qo'shilib ularning soniga bo'lish kerak.
- "выиграна" status'iga o'tgan lead'lar o'rtacha m2.

Agent rating'ini ko'rinishi:
- "выиграна" Lead'lar soni bo'yicha TOP-3 manager ism familiyasi va agency nomi.
- "выиграна" Lead'lar summasi bo'yicha TOP-3 manager ism familiyasi va agency nomi.
- Lead'lar yasalgan sanasidan "выиграна" status'iga o'tgan vaqtining, o'rtadagi sarflangan vaqtni eng kichiki bilan TOP-3 manager ism familiyasi va agency nomi.

Agency boshlig'i agent rating'ni ko'radi.

Admin va Affiliate manager city bo'yicha va vaqt oralig'i bo'yicha quyidagi ma'lumotlarni ko'radi:
- Ro'yxatdan o'tgan foydalanuvchilar soni jami va rollar bo'yicha
- Faol foydalanuvchilar soni (platformaga kirishning mavjudligi) jami va rollar bo'yicha
- Barcha yangiliklarni ko'rish soni jami
- Barcha yangiliklarni yoqtirishlar soni jami
- Yangiliklar bo'yicha yoqtirishlar ro'yhati, sanasi, kim qo'ygan
- Yaratilgan to'plamlar soni jami project'lar va builing'lar bo'yicha.
- "выиграна" status'iga o'tgan lead'larning soni
- "выиграна" status'iga o'tgan lead'lar mukofotlar summasi. Lead'dagi fee'dan olinadi.
- "выиграна" status'iga o'tgan lead'lar o'rtacha summasi. Premise price'dan olinadi va yig'indini ularni soniga bo'linadi.
- "выиграна" status'iga o'tgan lead'lar o'rtacha mukofotlar summasi. Lead'dagi fee'dan olinadi va yig'indini ularni soniga bo'linadi.
- "выиграна" status'iga o'tgan lead'lar o'rtacha m2.
- Eng yaxshi 5 ta yangilik (Ko'rishlar)
- Eng yaxshi 5 (qo'ng'iroqlar) o'quv modullari
- Eng yaxshi 5 ta tadbir (yozuvlar) 
- Status'dan status'ga o'tishlar soni.

- [ ] agency nomini unique qilish.
- [x] global search paginationni yana qarab chiqish.
- [x] premise'ga schema qo'shish.

truncate settings, comments, premises, leads, cities, agencies, users, projects, visits, clients, buildings, sections, premise_schemas, seasons, bookings, notification, news_views, news_categories, news_likes, contacts, contact_addresses, contact_work_schedules, premises_basket_meta, premises_basket, trainings_likes, trainings, trainings_views, trainings_categories, news, events, event_invitation, event_likes, event_views, event_contacts, lead_ops, analytics cascade RESTART IDENTITY;

- [x] global search'da client search bilan muamo chiqishi mumkin. chunki client globalda hamma client'ni qidiryapti, client search'ni o'zida esa user role'iga munosib.

- [x] event banner false bo'lganlari chiqib ketyapti.
- [x] Calendar'ga city bo'yicha filer.
- [x] Clinets uchun sort.
- [x] Inpateka bank calculator.
- [ ] Banner'ni settings'dan alohida olib chiqish kerak.
- [ ] Banner bulk.
