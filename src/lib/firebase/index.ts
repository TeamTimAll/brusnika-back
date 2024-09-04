import * as firebaseAdmin from "firebase-admin";

export interface FirebaseConfig {
	type: string;
	project_id: string;
	private_key_id: string;
	private_key: string;
	client_email: string;
	client_id: string;
	auth_uri: string;
	token_uri: string;
	auth_provider_x509_cert_url: string;
	client_x509_cert_url: string;
	universe_domain: string;
}

export interface FirebaseMessage<T> {
	token: string;
	title: string;
	message: string;
	data: T;
}

export class FirebaseService {
	private static app: firebaseAdmin.app.App;

	static init(config: FirebaseConfig) {
		this.app = firebaseAdmin.initializeApp({
			credential: firebaseAdmin.credential.cert({
				clientEmail: config.client_email,
				projectId: config.project_id,
				privateKey: config.private_key.replace(/\\n/g, "\n"),
			}),
		});
	}

	static sendMessage(token: string, title: string, message: string) {
		return firebaseAdmin.messaging(this.app).send({
			token: token,
			notification: {
				title: title,
				body: message,
			},
			android: {
				priority: "high",
				ttl: 1000 * 60 * 60 * 24, // 1 day
			},
		});
	}

	static sendMessageBulk<T>(messages: FirebaseMessage<T>[]) {
		return firebaseAdmin.messaging(this.app).sendEach(
			messages.map((m) => ({
				token: m.token,
				notification: {
					title: m.title,
					body: m.message,
				},
				data: { data: JSON.stringify(m.data) },
				android: {
					priority: "high",
					ttl: 1000 * 60 * 60 * 24, // 1 day
				},
			})),
		);
	}
}
