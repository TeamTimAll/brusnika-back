import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User2Controller } from "./user2.controller";
import { User2Entity } from "./user2.entity";
import { User2Service } from "./user2.service";


@Module({
  imports: [TypeOrmModule.forFeature([User2Entity])],
  controllers: [User2Controller],
  exports: [User2Service],
  providers: [User2Service],
})
export class User2Module {}
