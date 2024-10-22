import { Module } from "@nestjs/common";

import { ClientModule } from "../client/client.module";
import { EventsModule } from "../events/events.module";
import { NewsModule } from "../news/news.module";
import { ProjectsModule } from "../projects/projects.module";
import { UserModule } from "../user/user.module";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
	imports: [
		UserModule,
		ClientModule,
		ProjectsModule,
		NewsModule,
		EventsModule,
	],
	controllers: [SearchController],
	providers: [SearchService],
})
export class SearchModule {}
