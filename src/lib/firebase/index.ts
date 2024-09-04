import { messaging } from "firebase-admin";
import { App, cert, initializeApp } from "firebase-admin/app";

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

export interface FirebaseMessage {
	token: string;
	notification_type: string;
	message: string;
}

export class FirebaseService {
	private static app: App;

	static init(config: FirebaseConfig) {
		this.app = initializeApp({
			credential: cert({
				clientEmail: config.client_email,
				projectId: config.project_id,
				privateKey: config.private_key.replace(/\\n/g, "\n"),
			}),
		});
	}

	static sendMessage(
		token: string,
		notification_type: string,
		message: string,
	) {
		return messaging(this.app).send({
			token: token,
			notification: {
				title: notification_type,
				body: message,
			},
			android: {
				priority: "high",
				ttl: 1000 * 60 * 60 * 24, // 1 day
			},
		});
	}

	static sendMessageBulk(messages: FirebaseMessage[]) {
		return messaging(this.app).sendEach(
			messages.map((m) => ({
				token: m.token,
				notification: {
					title: m.notification_type,
					body: m.message,
				},
				android: {
					priority: "high",
					ttl: 1000 * 60 * 60 * 24, // 1 day
				},
			})),
		);
	}
}
