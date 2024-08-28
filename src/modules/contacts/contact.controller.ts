import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Inject,
	Post,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ApiDtoResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { ContactService } from "./contact.service";
import { ContactArrayMetaDataDto, ContactMetaDataDto } from "./dto/Contact.dto";
import { ContactBulkMetaDataDto } from "./dto/ContactBulk.dto";
import { ContactFilterDto } from "./dto/ContactFilter.dto";

@ApiTags("Contacts")
@Controller("contact")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class ContactController {
	constructor(
		@Inject()
		private readonly contactService: ContactService,
	) {}

	@Get()
	@ApiOperation({ summary: "Get all contacts" })
	@ApiDtoResponse(ContactArrayMetaDataDto, HttpStatus.OK)
	readAll(@Query() dto: ContactFilterDto, @User() user: ICurrentUser) {
		return this.contactService.readAll(user, dto);
	}

	@Post("bulk")
	@ApiOperation({ summary: "Bulk create, update, delete contacts" })
	@ApiDtoResponse(ContactMetaDataDto, HttpStatus.CREATED)
	bulk(@Body() dto: ContactBulkMetaDataDto) {
		return this.contactService.bulk(dto.data);
	}
}
