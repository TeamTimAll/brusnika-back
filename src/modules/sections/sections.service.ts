import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

import { BasicService } from "../../generic/service";

import { SectionsEntity } from "./sections.entity";
import { UpdateSectionsDto } from "./dtos/update-sections.dto";
import { CreateSectionsDto } from "./dtos/create-sections.dto";


export class SectionsService extends BasicService<
	SectionsEntity,
	CreateSectionsDto,
	UpdateSectionsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("Sections", SectionsEntity, dataSource);
	}
}
