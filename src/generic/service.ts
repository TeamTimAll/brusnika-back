import {
  DataSource,
  DeepPartial,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { ICurrentUser } from '../interfaces/current-user.interface';
import { IFind, IFindBy, IFindOne } from '../interfaces/find.interface';
import { CGeneric } from '../interfaces/res.generic.interface';
import { Uuid } from 'boilerplate.polyfill';

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

  async findAll(options?: IFind): Promise<CGeneric> {
    const findAllData = await this.repository.find({
      select: options?.select,
      relations: options?.relations,
      where: options?.where,
    });

    if (!findAllData.length) {
      return new CGeneric([`${this.param} not found`], 204, findAllData);
    }

    return new CGeneric([`${this.param} all data`], 200, findAllData);
  }

  async create(dto: CreateDto, currentUser?: ICurrentUser): Promise<CGeneric> {
    let createdData = this.repository.create({
      ...dto,
      createdBy: currentUser?.id,
    });

    createdData = await this.repository.save(createdData);

    return new CGeneric(
      [`${this.param} created successfully`],
      201,
      createdData,
    );
  }

  async update(
    id: Uuid, // Assuming UUID is a string
    dto: UpdateDto,
    currentUser?: ICurrentUser,
  ): Promise<CGeneric> {
    const existingData = (await this.findOne(id)).data;

    if (!existingData) {
      return new CGeneric([`${this.param} not found`], 204, null);
    }

    Object.assign(existingData, dto, {
      updatedAt: new Date(),
      updatedBy: currentUser?.id,
    });

    const updatedData = await this.repository.save(existingData);

    return new CGeneric(
      [`${this.param} updated successfully`],
      200,
      updatedData,
    );
  }

  async remove(id: string): Promise<CGeneric> {
    await this.repository.delete(id);

    return new CGeneric([`${this.param} deleted successfully`], 200, null);
  }

  async removeBy(options: object): Promise<CGeneric> {
    await this.repository.delete(options);

    return new CGeneric([`${this.param} deleted successfully`], 200, null);
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

  async findOne(id: Uuid, options?: IFindOne): Promise<CGeneric> {
    const findOne = await this.repository.findOne({
      select: options?.select,
      relations: options?.relations,
      where: { id },
    } as unknown as FindOneOptions<T>);

    if (!findOne) {
      return new CGeneric([`${this.param} not found`], 204, null);
    }

    return new CGeneric([`${this.param} data`], 200, findOne);
  }

  async findOneBy(options: IFindBy): Promise<CGeneric> {
    const findOneBy = await this.repository.findOne({
      select: options.select,
      relations: options.relations,
      where: options.where,
    } as FindOneOptions<T>);

    if (!findOneBy) {
      return new CGeneric([`${this.param} not found`], 204, null);
    }

    return new CGeneric([`${this.param} data`], 200, findOneBy);
  }
}
