import { Injectable } from "@nestjs/common";

import { AgencyEntity } from "../../agencies/agencies.entity";
import { AgencyService } from "../../agencies/agencies.service";
import { BookingsService } from "../../bookings/bookings.service";
import { BuildingEntity } from "../../buildings/buildings.entity";
import { BuildingsService } from "../../buildings/buildings.service";
import { CityEntity } from "../../cities/cities.entity";
import { CityService } from "../../cities/cities.service";
import { ClientService } from "../../client/client.service";
import { LeadsService } from "../../leads/leads.service";
import { PremisesService } from "../../premises/premises.service";
import { ProjectService } from "../../projects/projects.service";
import { SectionEntity } from "../../sections/sections.entity";
import { SectionsService } from "../../sections/sections.service";
import { UserEntity } from "../../user/user.entity";
import { UserService } from "../../user/user.service";
import { VisitsService } from "../../visits/visits.service";

import { BookingQueueDto } from "./dto/BookingQueue.dto";
import { BuildingQueueDto } from "./dto/BuildingQueue.dto";
import { CityQueueDto } from "./dto/CityQueue.dto";
import { ClientFixingQueueDto } from "./dto/ClientFixingQueue.dto";
import { ClientQueueDto } from "./dto/ClientQueue.dto";
import { LeadOpQueueDto } from "./dto/LeadOpQueue.dto";
import { LeadQueueDto } from "./dto/LeadQueue.dto";
import { PremiseQueueDto } from "./dto/PremiseQueue.dto";
import { ProjectQueueDto } from "./dto/ProjectQueue.dto";
import { SectionQueueDto } from "./dto/SectionQueue.dto";
import { TimeSlotsQueueDto } from "./dto/TimeSlotsQueue.dto";
import { UserQueueDto } from "./dto/UserQueue.dto";
import { VisitQueueDto } from "./dto/VisitQueue.dto";
import { EventType, EventsQueue } from "./dto/events.dto";

@Injectable()
export class EventsQueueService {
	constructor(
		private readonly clientService: ClientService,
		private readonly userService: UserService,
		private readonly projectService: ProjectService,
		private readonly premiseService: PremisesService,
		private readonly buildingService: BuildingsService,
		private readonly sectionService: SectionsService,
		private readonly cityService: CityService,
		private readonly leadService: LeadsService,
		private readonly agencyService: AgencyService,
		private readonly bookingService: BookingsService,
		private readonly visitService: VisitsService,
	) {}

	getAll(data: EventsQueue) {
		switch (data.type) {
			case EventType.PREMISE:
				return this.createOrUpdatePremise(data.data as PremiseQueueDto);
			case EventType.CITY:
				return this.createOrUpdateCity(data.data as CityQueueDto);
			case EventType.PROJECT:
				return this.createOrUpdateProject(data.data as ProjectQueueDto);
			case EventType.BUILDING:
				return this.createOrUpdateBuilding(
					data.data as BuildingQueueDto,
				);
			case EventType.SECTION:
				return this.createOrUpdateSection(data.data as SectionQueueDto);
			case EventType.LEAD:
				return this.createOrUpdateLead(data.data as LeadQueueDto);
			case EventType.LEAD_OP:
				return this.createOrUpdateLeadOp(data.data as LeadOpQueueDto);
			case EventType.TIME_SLOTS:
				return this.createOrUpdateTimeSlots(
					data.data as TimeSlotsQueueDto,
				);
			case EventType.USER:
				return this.createOrUpdateUser(data.data as UserQueueDto);
			case EventType.CLIENT:
				return this.createOrUpdateClient(data.data as ClientQueueDto);
			case EventType.CLIENT_FIXING:
				return this.createOrUpdateClientFixing(
					data.data as ClientFixingQueueDto,
				);
			case EventType.BOOKING:
				return this.createOrUpdateBooking(data.data as BookingQueueDto);
			case EventType.VISIT:
				return this.createOrUpdateVisit(data.data as VisitQueueDto);
		}
	}

	async createOrUpdatePremise(premise: PremiseQueueDto) {
		const building = await this.buildingService.readOneByExtId(
			premise.building_ext_id,
			{ id: true },
		);
		let section: Pick<SectionEntity, "id"> | undefined;
		if (premise.section_ext_id) {
			section = await this.sectionService.readOneByExtId(
				premise.section_ext_id,
				{ id: true },
			);
		}
		return this.premiseService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: premise.ext_id,
				type: premise.type,
				building_id: building.id,
				price: premise.price,
				size: premise.size,
				status: premise.status,
				number: premise.number,
				link: premise.link,
				floor: premise.floor,
				photo: premise.photo,
				rooms: premise.rooms,
				photos: premise.photos,
				similiarApartmentCount: premise.similiarApartmentCount,
				mortagePayment: premise.mortagePayment,
				section_id: section?.id,
				purchase_option: premise.purchase_option,
			})
			.orUpdate(
				[
					"type",
					"price",
					"size",
					"status",
					"number",
					"link",
					"floor",
					"photo",
					"rooms",
					"photos",
					"similiarApartmentCount",
					"end_date",
					"mortagePayment",
					"section_ext_id",
					"purchaseOption",
				] as Array<keyof PremiseQueueDto>,
				["ext_id"],
			)
			.execute();
	}

	createOrUpdateCity(city: CityQueueDto) {
		return this.cityService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: city.ext_id,
				name: city.name,
				long: city.long,
				lat: city.lat,
			})
			.orUpdate(["name", "long", "lat"], ["ext_id"])
			.execute();
	}

	async createOrUpdateProject(project: ProjectQueueDto) {
		const city = await this.cityService.readOneByExtId(
			project.city_ext_id,
			{ id: true },
		);
		return this.projectService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: project.ext_id,
				name: project.name,
				description: project.description,
				detailed_description: project.detailed_description,
				brief_description: project.brief_description,
				photo: project.photo,
				price: project.price,
				location: project.location,
				long: project.long,
				lat: project.lat,
				link: project.link,
				end_date: project.end_date,
				city_id: city.id,
			})
			.orUpdate(
				[
					"name",
					"description",
					"detailed_description",
					"brief_description",
					"photo",
					"price",
					"location",
					"long",
					"lat",
					"link",
					"end_date",
					"city_id",
				],
				["ext_id"],
			)
			.execute();
	}

	async createOrUpdateBuilding(building: BuildingQueueDto) {
		const project = await this.cityService.readOneByExtId(
			building.project_ext_id,
			{ id: true },
		);
		return this.buildingService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: building.ext_id,
				name: building.name,
				total_storage: building.total_storage,
				total_vacant_storage: building.total_vacant_storage,
				total_parking_space: building.total_parking_space,
				total_vacant_parking_space: building.total_vacant_parking_space,
				total_commercial: building.total_commercial,
				total_vacant_commercial: building.total_vacant_commercial,
				total_apartment: building.total_apartment,
				total_vacant_apartment: building.total_vacant_apartment,
				address: building.address,
				number_of_floors: building.number_of_floors,
				photos: building.photos,
				project_id: project.id,
			})
			.orUpdate(
				[
					"name",
					"total_storage",
					"total_vacant_storage",
					"total_parking_space",
					"total_vacant_parking_space",
					"total_commercial",
					"total_vacant_commercial",
					"total_apartment",
					"total_vacant_apartment",
					"address",
					"number_of_floors",
					"photos",
					"project_id",
				],
				["ext_id"],
			)
			.execute();
	}

	async createOrUpdateSection(section: SectionQueueDto) {
		let building: Pick<BuildingEntity, "id"> | undefined;
		if (section.building_ext_id) {
			building = await this.buildingService.readOneByExtId(
				section.building_ext_id,
				{ id: true },
			);
		}
		return this.sectionService.repostory
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: section.ext_id,
				name: section.name,
				building_id: building?.id,
			})
			.orUpdate(["name", "building_id"], ["ext_id"])
			.execute();
	}

	async createOrUpdateLead(lead: LeadQueueDto) {
		const client = await this.clientService.readOneByExtId(
			lead.client_ext_id,
		);
		const agent = await this.userService.readOneByExtId(lead.agent_ext_id);
		let manager: Pick<UserEntity, "id"> | undefined;
		if (lead.manager_ext_id) {
			manager = await this.userService.readOneByExtId(
				lead.manager_ext_id,
				{ id: true },
			);
		}
		const project = await this.projectService.readOneByExtId(
			lead.project_ext_id,
			{ id: true },
		);
		const premise = await this.premiseService.readOneByExtId(
			lead.premise_ext_id,
			{ id: true },
		);

		return this.leadService.leadRepository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: lead.ext_id,
				client_id: client.id,
				agent_id: agent.id,
				manager_id: manager?.id,
				project_id: project.id,
				premise_id: premise.id,
				comment: lead.comment,
				fee: lead.fee,
				current_status: lead.current_status,
				lead_number: lead.lead_number,
				state: lead.state,
			})
			.orUpdate(
				[
					"client_id",
					"agent_id",
					"manager_id",
					"project_id",
					"premise_id",
					"comment",
					"fee",
					"current_status",
					"lead_number",
					"state",
				],
				["ext_id"],
			)
			.execute();
	}

	async createOrUpdateLeadOp(lead_op: LeadOpQueueDto) {
		const lead = await this.leadService.readOneByExtId(
			lead_op.lead_ext_id,
			{ id: true },
		);

		await this.leadService.changeStatus(lead.id, lead_op.status);

		return this.leadService.leadOpsRepository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: lead_op.ext_id,
				lead_id: lead.id,
				status: lead_op.status,
			})
			.orUpdate(["lead_id", "status"], ["ext_id"])
			.execute();
	}

	createOrUpdateTimeSlots(_time_slots: TimeSlotsQueueDto) {
		//
	}

	async createOrUpdateUser(user: UserQueueDto) {
		let city: Pick<CityEntity, "id"> | undefined;
		if (user.city_ext_id) {
			city = await this.cityService.readOneByExtId(user.city_ext_id, {
				id: true,
			});
		}
		let agency: Pick<AgencyEntity, "id"> | undefined;
		if (user.agency_ext_id) {
			agency = await this.agencyService.readOneByExtId(
				user.agency_ext_id,
				{ id: true },
			);
		}
		return this.userService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: user.ext_id,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				email: user.email,
				username: user.username,
				password: user.password,
				phone: user.phone,
				birthDate: user.birthDate,
				workStartDate: user.workStartDate,
				avatar: user.avatar,
				is_phone_verified: user.is_phone_verified,
				is_email_verified: user.is_email_verified,
				temporary_role: user.temporary_role,
				status: user.status,
				city_id: city?.id,
				agency_id: agency?.id,
			})
			.orUpdate(
				[
					"firstName",
					"lastName",
					"role",
					"email",
					"username",
					"password",
					"phone",
					"birthDate",
					"workStartDate",
					"avatar",
					"is_phone_verified",
					"is_email_verified",
					"temporary_role",
					"status",
					"city_id",
					"agency_id",
				],
				["ext_id"],
			)
			.execute();
	}

	async createOrUpdateClient(client: ClientQueueDto) {
		let agent: Pick<UserEntity, "id"> | undefined;
		if (client.agent_ext_id) {
			agent = await this.userService.readOneByExtId(client.agent_ext_id, {
				id: true,
			});
		}
		return this.clientService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: client.ext_id,
				fullname: client.fullname,
				phone_number: client.phone_number,
				actived_date: client.actived_date,
				comment: client.comment,
				confirmation_type: client.confirmation_type,
				fixing_type: client.fixing_type,
				expiration_date: client.expiration_date,
				node: client.node,
				agent_id: agent?.id,
				fixing_type_updated_at: new Date(),
			})
			.orUpdate(
				[
					"fullname",
					"phone_number",
					"actived_date",
					"comment",
					"confirmation_type",
					"fixing_type",
					"expiration_date",
					"node",
					"agent_id",
				],
				["ext_id"],
			)
			.execute();
	}

	async createOrUpdateClientFixing(clientFixing: ClientFixingQueueDto) {
		const client = await this.clientService.readOneByExtId(
			clientFixing.client_ext_id,
			{ id: true },
		);
		return this.clientService.repository.update(client.id, {
			fixing_type: clientFixing.fixing_type,
			fixing_type_updated_at: new Date(),
		});
	}

	async createOrUpdateBooking(booking: BookingQueueDto) {
		const foundBooking = await this.bookingService.readOneByExtId(
			booking.booking_ext_id,
			{ id: true, agent: { id: true } },
		);
		return this.bookingService.update(foundBooking.id, {
			status: booking.status,
		});
	}

	async createOrUpdateVisit(visit: VisitQueueDto) {
		const foundVisit = await this.visitService.readOneByExtId(
			visit.visit_ext_id,
			{ id: true },
		);
		return this.visitService.update(foundVisit.id, {
			status: visit.status,
		});
	}
}
