import * as fs from "fs";

import { Injectable } from "@nestjs/common";
import * as mime from "mime-types";

import { InvalidFileTypeError } from "../../common/errors/InvalidFileTypeError";

@Injectable()
export class FileUploadService {
	private readonly uploadPath = process.cwd() + "/media";

	async uploadImage(file: Express.Multer.File): Promise<string> {
		const fileExtension = mime.extension(file.mimetype);
		if (!fileExtension) {
			throw new InvalidFileTypeError();
		}

		const randomName: string =
			new Date().getTime().toString() + "." + fileExtension;

		if (!fs.existsSync(this.uploadPath)) {
			fs.mkdirSync(this.uploadPath);
		}

		const filePath = `${this.uploadPath}/${randomName}`;

		await fs.promises.writeFile(filePath, file.buffer);

		return randomName;
	}
}
