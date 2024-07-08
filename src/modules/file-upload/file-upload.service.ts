import * as fs from "fs"; // Import the 'fs' module for file system operations

import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import * as mime from "mime-types";

@Injectable()
export class FileUploadService {
	// Define the upload destination folder (adjust the path as needed)
	private readonly uploadPath = process.cwd() + "/media";

	async uploadImage(file: Express.Multer.File): Promise<string> {
		try {
			const fileExtension = mime.extension(file.mimetype);
			if (!fileExtension) {
				throw new HttpException(
					"Invalid file type",
					HttpStatus.BAD_REQUEST,
				);
			}

			const randomName: string =
				new Date().getTime().toString() + "." + fileExtension;

			// Create the upload directory if it doesn't exist
			if (!fs.existsSync(this.uploadPath)) {
				fs.mkdirSync(this.uploadPath);
			}

			// Build the complete file path
			const filePath = `${this.uploadPath}/${randomName}`;

			// Write the file to the upload directory
			await fs.promises.writeFile(filePath, file.buffer);

			return randomName; // Return the generated filename
		} catch (error) {
			Logger.error("Error during file upload:", error);
			throw new HttpException(
				"File upload failed",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
