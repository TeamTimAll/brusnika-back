import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type PageDto } from '../../common/dto/page.dto';
import { CreateAgenciesDto } from './dtos/create-agencies.dto';
import { type AgenciesDto } from './dtos/agencies.dto';
import { type AgenciesPageOptionsDto } from './dtos/agencies-page-options.dto';
import { type UpdateAgenciesDto } from './dtos/update-agencies.dto';
import { AgenciesNotFoundException } from './exceptions/agencies-not-found.exception';
import { AgenciesEntity } from './agencies.entity';
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(AgenciesEntity)
    private AgenciesRepository: Repository<AgenciesEntity>,
  ) {}

  async createAgencies(
    userId: Uuid,
    createAgenciesDto: CreateAgenciesDto,
  ): Promise<AgenciesEntity> {
    createAgenciesDto.userId = userId;
    const createdEvent: AgenciesEntity =
      await this.AgenciesRepository.save(createAgenciesDto);
    return createdEvent;
  }

  async getAllAgencies(
    AgenciesPageOptionsDto: AgenciesPageOptionsDto,
  ): Promise<PageDto<AgenciesDto>> {
    const queryBuilder = this.AgenciesRepository.createQueryBuilder('Agencies');

    const [items, pageMetaDto] =
      await queryBuilder.paginate(AgenciesPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleAgencies(id: Uuid): Promise<AgenciesEntity> {
    const queryBuilder = this.AgenciesRepository
      .createQueryBuilder('Agencies')
      .where('Agencies.id = :id', { id });

    const AgenciesEntity = await queryBuilder.getOne();

    if (!AgenciesEntity) {
      throw new AgenciesNotFoundException();
    }

    return AgenciesEntity;
  }

  async updateAgencies(
    id: Uuid,
    updateAgenciesDto: UpdateAgenciesDto,
  ): Promise<void> {
    const queryBuilder = this.AgenciesRepository
      .createQueryBuilder('Agencies')
      .where('Agencies.id = :id', { id });

    const AgenciesEntity = await queryBuilder.getOne();

    if (!AgenciesEntity) {
      throw new AgenciesNotFoundException();
    }

    await this.AgenciesRepository.merge(AgenciesEntity, updateAgenciesDto);

    await this.AgenciesRepository.save(updateAgenciesDto);
  }

  async deleteAgencies(id: Uuid): Promise<void> {
    const queryBuilder = this.AgenciesRepository
      .createQueryBuilder('Agencies')
      .where('Agencies.id = :id', { id });

    const AgenciesEntity = await queryBuilder.getOne();

    if (!AgenciesEntity) {
      throw new AgenciesNotFoundException();
    }

    await this.AgenciesRepository.remove(AgenciesEntity);
  }
}
