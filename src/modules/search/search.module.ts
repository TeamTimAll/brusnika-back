import { Module } from "@nestjs/common";

import { AnalyticsModule } from "../analytics/analytics.module";
import { UserModule } from "../user/user.module";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
	imports: [UserModule, AnalyticsModule],
	controllers: [SearchController],
	providers: [SearchService],
})
export class SearchModule {}
