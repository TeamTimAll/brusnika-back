import {
	CommercialStatus,
	PremiseFeature,
	PremisesType,
} from "../../../premises/premises.entity";
import { PuchaseOptions } from "../../../visits/visits.entity";

export interface IPremise {
	ext_id: string;
	name: string;
	type: PremisesType;
	building_id: number;
	price: bigint;
	size: number;
	status?: CommercialStatus;
	number?: number;
	link?: string;
	floor?: number;
	photo?: string;
	rooms?: number;
	photos?: string[];
	similiarApartmentCount?: number;
	mortagePayment?: number;
	section_id?: number;
	purchase_option?: PuchaseOptions[];
	feature?: PremiseFeature[];
}
