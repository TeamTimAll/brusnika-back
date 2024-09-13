import crypto from "crypto";

import { ConfigManager } from "../config";

interface IEncryptedText {
	key: string;
	iv: string;
	data: string;
}

export function encryptText(plainText: string): string {
	const aesKey = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16); // Initialization vector
	const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
	let encryptedData = cipher.update(plainText, "utf8", "base64");
	encryptedData += cipher.final("base64");
	const encryptedKey = crypto
		.publicEncrypt(
			{
				key: ConfigManager.config.PUBLIC_KEY,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha256",
			},
			aesKey,
		)
		.toString("base64");

	return JSON.stringify({
		key: encryptedKey,
		iv: iv.toString("base64"),
		data: encryptedData,
	});
}

export function decryptText(encryptedText: string): string {
	const {
		key: encryptedKey,
		iv,
		data,
	} = JSON.parse(encryptedText) as IEncryptedText;
	const decryptedAesKey = crypto.privateDecrypt(
		{
			key: ConfigManager.config.PRIVATE_KEY,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		Buffer.from(encryptedKey, "base64"),
	);
	const decipher = crypto.createDecipheriv(
		"aes-256-cbc",
		decryptedAesKey,
		Buffer.from(iv, "base64"),
	);
	let decryptedData = decipher.update(data, "base64", "utf8");
	decryptedData += decipher.final("utf8");

	return decryptedData;
}
