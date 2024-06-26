import { HttpStatus } from "@nestjs/common";
import {
	DataSource,
	DeepPartial,
	FindOneOptions,
	ObjectLiteral,
	Repository,
} from "typeorm";

import { ICurrentUser } from "../interfaces/current-user.interface";
import { IFind, IFindBy, IFindOne } from "../interfaces/find.interface";
import { ServiceResponse } from "../interfaces/serviceResponse.interface";

export class BasicService<
	T extends ObjectLiteral,
	CreateDto extends DeepPartial<T>,
	UpdateDto extends DeepPartial<T>,
> {
	readonly repository: Repository<T>;

	constructor(
		private readonly param: string,
		entity: { new (): T },
		dataSource: DataSource,
	) {
		this.repository = dataSource.getRepository(entity);
	}

	async findAll<T = unknown>(options?: IFind): Promise<ServiceResponse<T>> {
		const findAllData = await this.repository.find({
			select: options?.select,
			relations: options?.relations,
			where: options?.where,
		});

		if (!findAllData.length) {
			return new ServiceResponse<T>(
				[`${this.param} not found`],
				HttpStatus.NOT_FOUND,
				findAllData as unknown as T[],
			);
		}

		return new ServiceResponse<T>(
			[`${this.param} all data`],
			HttpStatus.OK,
			findAllData as unknown as T[],
		);
	}

	async r_findAll(options?: IFind) {
		return this.repository.find({
			select: options?.select,
			relations: options?.relations,
			where: options?.where,
		});
	}

	async create<T>(
		dto: CreateDto,
		currentUser?: ICurrentUser,
	): Promise<ServiceResponse<T>> {
		let createdData = this.repository.create({
			...dto,
			createdBy: currentUser?.user_id,
		});

		createdData = await this.repository.save(createdData);

		return new ServiceResponse<T>(
			[`${this.param} created successfully`],
			HttpStatus.CREATED,
			[createdData as unknown as T],
		);
	}

	async update(
		id: string, // Assuming UUID is a string
		dto: UpdateDto,
		currentUser?: ICurrentUser,
	): Promise<ServiceResponse> {
		const [existingData] = (await this.findOne(id)).data;

		if (!existingData) {
			return new ServiceResponse(
				[`${this.param} not found`],
				HttpStatus.NO_CONTENT,
			);
		}

		Object.assign(existingData, dto, {
			updatedAt: new Date(),
			updatedBy: currentUser?.user_id,
		});

		const updatedData = await this.repository.save(
			existingData as DeepPartial<T>,
		);

		return new ServiceResponse(
			[`${this.param} updated successfully`],
			HttpStatus.OK,
			[updatedData],
		);
	}

	async remove(id: string): Promise<ServiceResponse> {
		await this.repository.delete(id);

		return new ServiceResponse(
			[`${this.param} deleted successfully`],
			HttpStatus.OK,
		);
	}

	async removeBy(options: object): Promise<ServiceResponse> {
		await this.repository.delete(options);

		return new ServiceResponse(
			[`${this.param} deleted successfully`],
			HttpStatus.OK,
		);
	}

	//   async softDelete(id: string, currentUser?: ICurrentUser): Promise<CGeneric> {
	//     const existingData = await this.repository.findOne({ where: { id } });

	//     if (!existingData) {
	//       return new CGeneric([`${this.param} not found`], 204, null);
	//     }

	//     Object.assign(existingData, {
	//       deletedAt: new Date(),
	//       status: false,
	//       deletedBy: currentUser?.id,
	//     });

	//     const softDeletedData = await this.repository.save(existingData);

	//     return new CGeneric(
	//       [`${this.param} deleted successfully`],
	//       200,
	//       softDeletedData,
	//     );
	//   }

	async findOne<E = unknown>(
		id: string,
		options?: IFindOne,
	): Promise<ServiceResponse<E>> {
		const findOne = await this.repository.findOne({
			select: options?.select,
			relations: options?.relations,
			where: { id },
		} as unknown as FindOneOptions<T>);

		if (!findOne) {
			return new ServiceResponse(
				[`${this.param} not found`],
				HttpStatus.NO_CONTENT,
			);
		}

		return new ServiceResponse([`${this.param} data`], HttpStatus.OK, [
			findOne as unknown as E,
		]);
	}

	async findOneBy(options: IFindBy): Promise<ServiceResponse> {
		const findOneBy = await this.repository.findOne({
			select: options.select,
			relations: options.relations,
			where: options.where,
		} as FindOneOptions<T>);

		if (!findOneBy) {
			return new ServiceResponse(
				[`${this.param} not found`],
				HttpStatus.NO_CONTENT,
			);
		}

		return new ServiceResponse([`${this.param} data`], HttpStatus.OK, [
			findOneBy,
		]);
	}
}
