export interface IAgency {
	url: string;
	method: string;
	data: {
		countourId: string;
		city?: string;
		agency: string | null;
		organizationalLegalForm: string | null;
		inn: string | null;
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
	};
}
