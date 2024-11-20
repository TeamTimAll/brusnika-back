export interface IBooking {
	url: string;
	method: string;
	data: {
		requestType: string;
		contourId: string;
		contacts: {
			phone?: string | null;
			name?: string;
		};
		data: {
			flatIdC: string;
			payment_method: string;
			ga_client_id: string;
			metrika_client_id: string;
		};
		referer: string;
	};
}
