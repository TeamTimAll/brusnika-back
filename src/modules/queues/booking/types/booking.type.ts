export interface IBooking {
	url: string;
	method: string;
	data: {
		paymentMethod: string;
		duration: number;
		channel: {
			agentId?: string | null;
		};
		premiseId?: string | null;
		personId?: string | null;
	};
}
