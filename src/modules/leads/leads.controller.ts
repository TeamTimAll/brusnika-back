import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Leads")
@Controller("leads")
export class LeadsController {
	constructor(/*private dealsService: LeadsService*/) {}
}
