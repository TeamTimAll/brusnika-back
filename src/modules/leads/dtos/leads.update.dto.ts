import { PartialType } from "@nestjs/mapped-types";

import { CreateLeadDto } from "./leads.create.dto";

export class UpdateDealsDto extends PartialType(CreateLeadDto) {}
