import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type PageDto } from '../../common/dto/page.dto';
import { CreateCitiesDto } from './dtos/create-cities.dto';
import { type CitiesDto } from './dtos/cities.dto';
import { type CitiesPageOptionsDto } from './dtos/cities-page-options.dto';
import { type UpdateCitiesDto } from './dtos/update-cities.dto';
import { CitiesNotFoundException } from './exceptions/cities-not-found.exception';
import { CitiesEntity } from './cities.entity';
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CitiesEntity)
    private CitiesRepository: Repository<CitiesEntity>,
  ) {}

  async createCities(createCitiesDto: CreateCitiesDto): Promise<CitiesEntity> {
    const createdCity: CitiesEntity =
      await this.CitiesRepository.save(createCitiesDto);
    return createdCity;
  }

  async getAllCities(
    CitiesPageOptionsDto: CitiesPageOptionsDto,
  ): Promise<PageDto<CitiesDto>> {
    const queryBuilder = this.CitiesRepository.createQueryBuilder('Cities');

    const [items, pageMetaDto] =
      await queryBuilder.paginate(CitiesPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleCities(id: Uuid): Promise<CitiesEntity> {
    const queryBuilder = this.CitiesRepository.createQueryBuilder(
      'Cities',
    ).where('Cities.id = :id', { id });

    const CitiesEntity = await queryBuilder.getOne();

    if (!CitiesEntity) {
      throw new CitiesNotFoundException();
    }

    return CitiesEntity;
  }

  async updateCities(
    id: Uuid,
    updateCitiesDto: UpdateCitiesDto,
  ): Promise<void> {
    const queryBuilder = this.CitiesRepository.createQueryBuilder(
      'Cities',
    ).where('Cities.id = :id', { id });

    const CitiesEntity = await queryBuilder.getOne();

    if (!CitiesEntity) {
      throw new CitiesNotFoundException();
    }

    await this.CitiesRepository.merge(CitiesEntity, updateCitiesDto);

    await this.CitiesRepository.save(updateCitiesDto);
  }

  async deleteCities(id: Uuid): Promise<void> {
    const queryBuilder = this.CitiesRepository.createQueryBuilder(
      'Cities',
    ).where('Cities.id = :id', { id });

    const CitiesEntity = await queryBuilder.getOne();

    if (!CitiesEntity) {
      throw new CitiesNotFoundException();
    }

    await this.CitiesRepository.remove(CitiesEntity);
  }
}
