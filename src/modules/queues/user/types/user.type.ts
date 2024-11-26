export interface IUser {
	url: string;
	method: string;
	data: {
		clients: {
			title: string;
			email?: string | null;
			phone: string | null;
			person: {
				firstName: string | null;
				lastName: string | null;
				birthday: Date | null;
			};
			contactType: {
				isAgent: boolean;
				isContractor: boolean;
				isRealEstateAgency: boolean;
				isClient: boolean;
				isAppraiser: boolean;
				isPartnerOnline: boolean;
			};
			realEstateAgency: {
				id?: string | null;
			};
			notSendSms: boolean;
		}[];
	};
}
