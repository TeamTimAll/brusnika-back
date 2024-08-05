import { join } from "path";

import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";

import { AuthModule } from "./auth/auth.module";
import { BookingsModule } from "./bookings/bookings.module";
import { BuildingsModule } from "./buildings/buildings.module";
import { CalendarModule } from "./calendar/calendar.module";
import { CityModule } from "./cities/cities.module";
import { ClientModule } from "./client/client.module";
import { CommentsModule } from "./comments/comments.module";
import { EventsModule } from "./events/events.module";
import { FileUploadModule } from "./file-upload/file-upload.module";
import { LeadsModule } from "./leads/leads.module";
import { NewsModule } from "./news/news.module";
import { PremisesModule } from "./premises/premises.module";
import { PremisesBasketModule } from "./premises_basket/premises_basket.module";
import { PremisesBasketMetaModule } from "./premises_basket_meta/premises_basket_meta.module";
import { ProjectsModule } from "./projects/projects.module";
import { SectionsModule } from "./sections/sections.module";
import { TrainingsModule } from "./trainings/trainings.module";
import { UserModule } from "./user/user.module";
import { VisitsModule } from "./visits/visits.module";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), "media"),
			serveRoot: "/api/files",
		}),
		UserModule,
		EventsModule,
		AuthModule,
		ClientModule,
		TrainingsModule,
		LeadsModule,
		CityModule,
		FileUploadModule,
		NewsModule,
		CommentsModule,
		ProjectsModule,
		BuildingsModule,
		PremisesModule,
		SectionsModule,
		BookingsModule,
		VisitsModule,
		PremisesBasketModule,
		PremisesBasketMetaModule,
		CalendarModule,
	],
	exports: [],
})
export class SecuredModule {}
