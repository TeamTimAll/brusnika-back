export interface IVisit {
	url: string;
	method: string;
	data: {
		requestType: string;
		type: string;
		project?: string | null;
		premisesKind?: string | null;
		date: string;
		name?: string;
		phone?: string;
		realtor: {
			phone?: string | null;
			name?: string;
			agency?: string | null;
		};
	};
}
