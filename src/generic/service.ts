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

/**
 * Base service
 * Methods:
 * 1. findAll
 * 2. create
 * 3. update
 * 4. remove
 * 5. softDelete
 * 6. findOne
 * 7. findOneBy
 */
export class BasicService<
  T extends ObjectLiteral,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>,
> {
  readonly repository: Repository<T>;

  /**
   * @param param - what is worked with
   * @param entity - entity
   * @param dataSource - data source
   */
  constructor(
    private readonly param: string,
    private readonly entity: { new (): T },
    private readonly dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(entity);
  }

  /**
   * Find all entities
   * @param options - TypeORM find method options
   * @returns - CGeneric response
   */
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

  /**
   * Create a new entity
   * @param dto - Data transfer object for creating an entity
   * @param currentUser - Current user creating the entity
   * @returns - CGeneric response
   */
  async create(dto: CreateDto, currentUser?: ICurrentUser): Promise<CGeneric> {
    let createdData = this.repository.create(dto);

    createdData = await this.repository.save(createdData);

    return new CGeneric(
      [`${this.param} created successfully`],
      201,
      createdData,
    );
  }

  /**
   * Updates the data
   * @param id - Id to find the data
   * @param dto - update the data
   * @param currentUser - who updates the data
   * @returns - CGeneric response
   */
  async update(
    id: Uuid,
    dto: UpdateDto,
    currentUser?: ICurrentUser,
  ): Promise<CGeneric> {
    let updatedData = await this.findOne(id);

    if (!updatedData || !updatedData.data) {
      return new CGeneric([`${this.param} not found`], 204, updatedData.data);
    }

    Object.assign(updatedData.data, dto);
    updatedData.data.updatedAt = new Date();

    if (currentUser?.id) {
      updatedData.data.updatedBy = currentUser.id;
    }

    updatedData = await this.repository.save(updatedData.data);

    return new CGeneric(
      [`${this.param} updated successfully`],
      200,
      updatedData,
    );
  }

  /**
   * Remove an entity
   * @param id - Id to find the data
   * @returns - CGeneric response
   */
  async remove(id: number): Promise<CGeneric> {
    const removed = await this.repository.delete(id);

    return new CGeneric([`${this.param} deleted successfully`], 200, removed);
  }

  /**
   * Remove entities by criteria
   * @param options - find criteria
   * @returns - CGeneric response
   */
  async removeBy(options: object): Promise<CGeneric> {
    const removed = await this.repository.delete(options);

    return new CGeneric([`${this.param} deleted successfully`], 200, removed);
  }

  /**
   * Soft delete an entity
   * @param id - Id to find the data
   * @param currentUser - who deletes the data
   * @returns - CGeneric response
   */
  async softDelete(id: Uuid, currentUser?: ICurrentUser): Promise<CGeneric> {
    let softDelete = await this.findOne(id);

    if (!softDelete || !softDelete.data) {
      return new CGeneric([`${this.param} not found`], 204, softDelete.data);
    }

    softDelete.data.deletedAt = new Date();
    softDelete.data.status = false;

    if (currentUser?.id) {
      softDelete.data.deletedBy = currentUser.id;
    }

    softDelete = await this.repository.save(softDelete.data);

    return new CGeneric(
      [`${this.param} deleted successfully`],
      200,
      softDelete,
    );
  }

  /**
   * Find one entity by id
   * @param id - Id to find the data
   * @param options - optional find options
   * @returns - CGeneric response
   */
  async findOne(id: Uuid, options?: IFindOne): Promise<CGeneric> {
    const findOne = await this.repository.findOne({
        select: options?.select,
        relations: options?.relations,
        where: { id },
    } as unknown as FindOneOptions<T>);

    if (!findOne) {
      return new CGeneric([`${this.param} not found`], 204, findOne);
    }

    return new CGeneric([`${this.param} data`], 200, findOne);
  }

  /**
   * Find one entity by criteria
   * @param options - find criteria
   * @returns - CGeneric response
   */
  async findOneBy(options: IFindBy): Promise<CGeneric> {
    const findOneBy = await this.repository.findOne({
      select: options.select,
      relations: options.relations,
      where: options.where,
    });

    if (!findOneBy) {
      return new CGeneric([`${this.param} not found`], 204, findOneBy);
    }

    return new CGeneric([`${this.param} data`], 200, findOneBy);
  }
}
