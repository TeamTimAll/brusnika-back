import { PartialType } from "@nestjs/mapped-types";

import { LeadsCreateDto } from "./leads.create.dto";

export class UpdateDealsDto extends PartialType(LeadsCreateDto) {}
