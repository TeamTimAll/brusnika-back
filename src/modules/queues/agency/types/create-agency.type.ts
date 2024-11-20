export interface IAgency {
	url: string;
	method: string;
	data: {
		contourId: string;
		city?: string;
		agency: string | null;
		organizationalLegalForm: string | null;
		inn: string | null;
		agencyFull: string;
		okved: string;
		phone: string | null;
		email: string | null;
		taxRegistrationRef: string | null;
		ogrnRef: string | null;
		agencyRef: string | null;
		basisForSigningRef: string | null;
		contactPersonName?: string | null;
		contactPersonPosition?: string | null;
		contactPersonPhone?: string | null;
		citiesWork: (string | undefined)[];
		registrationAgencyDate: string;
		vatAvailability: boolean;
		agencyWorkingTerm: {
			count: number;
			unit: string;
		};
		employees: number;
		reasonAgreements: string;
		agreementsAnotherDeveloper: {
			availability: boolean;
			developerList: string[];
		};
		associations: {
			availability: boolean;
			associationList: string[];
		};
		amountDealsMonth: string;
		signer: string;
		basisForSigning: string;
		siteLinks: string[];
	};
}
