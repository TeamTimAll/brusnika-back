// import fs from "fs";

// import { Logger } from "@nestjs/common";

import { ConfigManager } from "../config";
import { /*FirebaseConfig,*/ FirebaseService } from "../lib/firebase";

// import { RabbitMQClient } from "./RabbitMQ";
import { Http } from "./http";
import { OrmManager } from "./orm";
import { SwaggerManager } from "./swagger";

export class Application {
	static async init() {
		ConfigManager.init();
		OrmManager.init();

		await Http.init();
		SwaggerManager.init(Http.app);
		await Http.listen();

		// const firebaseConfigData = fs.readFileSync("./firebase.json", "utf8");
		// if (!firebaseConfigData && !firebaseConfigData.length) {
		// 	throw new Error("Firebase config not found!");
		// }
		// const firebaseConfig = JSON.parse(firebaseConfigData) as FirebaseConfig;

		FirebaseService.init({
			type: "service_account",
			project_id: "brusnika-3109c",
			private_key_id: "df588295f01930f727e5b6b09f2b145ce587c729",
			private_key:
				"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCTflxqd1C6zSb/\n2X22EqbCwsC1XBtyaikiyTwgZ6Bb9DFg7R3QrnOgl/h7V23b8O5zmXSE8b/yC/4J\nZ6UD5mrx9sOeARUYUhZbtoEUDD4RZfUZVFWdBfYjHYByj7nNR6B8jbIvjrF5+3Up\niLpjo4MKfnAwYdHGqoONpo/5U2bfivP+BG8cCzK/XCauyMw/txtgbtxcK9LUvW7f\nw0HL/zLbOBBcuybSvMx9T0SfqpP8DkOmsH1omou7fYmX+iZWkJE1s/sE9b5uibfr\n3mW4f9IECj7AMdN30YeH5uxGHmyMwETqvIXxzZj/Py4xMMtAOsztp0R6myeS+U8c\nDHDjP8T9AgMBAAECggEAOhdGptgff7NVbOdoT9HAxGyYIdYJKWMOmJjRiaHG0vC2\nkgpR9+L9v36ba1jf+ARIplcGQWZFxztZ7rJXl9WkwXADU7PxbwbFr5GN/StlNs0F\nX9iLb7DtZJ81++kHsQZI+0WDrJ9y3yxe1OD5KE06S2PJJAUi7jAyaBP2GKj0l441\noKj934wXL2SW+6oKJwWEhxBMbqXZ9Hp4xZk9qg8CuuQcLA93w76FvWVXonn/uE+G\njtIUIB34nXVdyCETIxmYN1Qzk3X21BdT3KA4xsmQJ6lQeqLYOvA/sMnRdgxJs14z\nITLh/srKo5gpkVnPi80sq0dGVPFZHGqjuYRtN/0ysQKBgQDKhmJJNpIMEkfz4BYn\n6b7EDWWSPsK+KQTAPZq3WNY7h0OP5blDkYBn+wJaK0XAjjTQaz4BPGGRZcsYpMua\nQ/HcfvY7b6Ier+g7A9Lh6ijgoBrRU1CPeGWIVbqp4/kdzZmAzOHsuJYATbqgkk0L\nQ0SkvKWKgFAN/Q5YQFBWeVXg4wKBgQC6cCYwcZLKmo33YIUe6P7uWQ7jYFBHtHHl\nVvYBtZA5H8JJeoCFUhLXhHOqJiVAGyRSSBiZllKtfyx6aqTa0aF9XOu9DDTvbJvG\nk6m19eiWXzMlLx5AfSz49RBZE6iA7zv3LgUYPCUikVsqEedFle122v/it9jJO78+\ns6pDeDYInwKBgQCT3vjmcfTC4Zoto4Ep1U5XQVzXIgH47GQupQxRMIkDX+jhqR7T\nCerSgQCfq5a7WFmRj6vvJRIsIkHfFXwff9qZXw4UKZcaht+uL0WLc/gywlOyYP2i\nM4sWt1mab/zVWOfqli2jNMc5I4fPc+LTBWOaUK8h6DwLaqhNoW/HI8KjdwKBgAoU\n9nu4KI/8O6Ec/xXk06Rf/IYfNzgpcd9NDJCbGOl95ivDDCApiAtPhlG1Ll6BGT25\n2Fq13lKzhdw42CFdJLZ6x+S5PEOWQ/ZBFfRZD/LRwxpHqgMiwcPUvMWUYpBWX4/G\nVVAyMG/mHF/yB+eja+v5e8zu1DJNoNHrNVHgtktRAoGARvcodZyE1LIhJTcH7chF\ne1w5MfAdaZPCAO34oRYJA+Hs3oi+3/s4IOFH9F6VIZKcHdyAXMFk4OdHJwFhIbws\nvLkhTS/5jP86dlICNyd5w24GovbmCPGRbcRvZ8obmpH3VqlHgi8wahRS7dOcB+Pf\n2wT5lb7KsN3XYEa3rTe0GaA=\n-----END PRIVATE KEY-----\n",
			client_email:
				"firebase-adminsdk-upyed@brusnika-3109c.iam.gserviceaccount.com",
			client_id: "117057661006562590383",
			auth_uri: "https://accounts.google.com/o/oauth2/auth",
			token_uri: "https://oauth2.googleapis.com/token",
			auth_provider_x509_cert_url:
				"https://www.googleapis.com/oauth2/v1/certs",
			client_x509_cert_url:
				"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-upyed%40brusnika-3109c.iam.gserviceaccount.com",
			universe_domain: "googleapis.com",
		});

		// await RabbitMQClient.init(new Logger("RabbitMQServer"));
		// await RabbitMQClient.listen();
	}
}
