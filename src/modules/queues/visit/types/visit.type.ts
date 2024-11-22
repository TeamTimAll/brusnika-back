export interface IVisit {
	url: string;
	method: string;
	data: {
		requestType: string;
		type: string;
		project?: string;
		premisesKind?: string | null;
		date: Date;
		name?: string;
		phone?: string;
		realtor: {
			phone?: string | null;
			name?: string;
			agency?: string | null;
		};
	};
}
