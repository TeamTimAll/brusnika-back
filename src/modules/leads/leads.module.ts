import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientModule } from "../client/client.module";

import { LeadsController } from "./leads.controller";
import { LeadsEntity } from "./leads.entity";
import { LeadsService } from "./leads.service";

@Module({
	imports: [ClientModule, TypeOrmModule.forFeature([LeadsEntity])],
	controllers: [LeadsController],
	providers: [LeadsService],
})
export class LeadsModule {}
