import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { BuildingsModule } from "./buildings/buildings.module";
import { CitiesModule } from "./cities/cities.module";
import { ClientStatusModule } from "./client-status/client-status.module";
import { ClientModule } from "./client/client.module";
import { CommentsModule } from "./comments/comments.module";
import { DealsModule } from "./deals/deals.module";
import { EventsModule } from "./events/events.module";
import { FileUploadModule } from "./file-upload/file-upload.module";
import { NewsModule } from "./news/news.module";
import { PremisesModule } from "./premises/premises.module";
import { ProjectsModule } from "./projects/projects.module";
import { SectionsModule } from "./sections/sections.module";
import { TrainingModule } from "./training/training.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), "uploads"),
			serveRoot: "/api/files",
		}),
		UserModule,
		EventsModule,
		AuthModule,
		ClientModule,
		ClientStatusModule,
		TrainingModule,
		DealsModule,
		CitiesModule,
		FileUploadModule,
		NewsModule,
		CommentsModule,
		ProjectsModule,
		BuildingsModule,
		PremisesModule,
		SectionsModule,
	],
	exports: [],
})
export class SecuredModule {}
