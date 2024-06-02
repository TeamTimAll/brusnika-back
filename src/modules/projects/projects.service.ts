import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { Uuid } from 'boilerplate.polyfill';
import { HttpException } from '@nestjs/common';
import { CreateProjectDto } from './dto/project.create.dto';
import { UpdateProjectDto } from './dto/projects.update.dto';
import { PremisesType } from '../premises/premises.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectsRepository: Repository<ProjectEntity>,
  ) {}

  async getAllProjects(): Promise<any[]> {
    const rawResult = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.buildings', 'building')
      .leftJoin('building.premises', 'premise')
      .select([
        'project.id AS id',
        'project.name AS name',
        'project.detailedDescription AS detailed_description',
        'project.briefDescription AS brief_description',
        'project.photo AS photo',
        'project.price AS price',
        'project.location AS location',
        'project.long AS long',
        'project.lat AS lat',
        'project.link AS link',
        'project.end_date AS end_date',
        'premise.type AS premise_type',
        'COUNT(premise.id) AS premise_count',
      ])
      .groupBy('project.id, premise.type')
      .getRawMany();

    console.log(rawResult);

    const validTypes = Object.values(PremisesType);

    const formattedResult = rawResult.reduce((acc, row) => {
      const projectId = row.id;

      let project = acc.find((p) => p.projectId === projectId);
      if (!project) {
        project = {
          projectId,
          name: row.name,
          detailedDescription: row.detailed_description,
          briefDescription: row.brief_description,
          photo: row.photo,
          price: row.price,
          location: row.location,
          long: row.long,
          lat: row.lat,
          link: row.link,
          end_date: row.end_date,
        };
        validTypes.forEach((type) => {
          project[`${type.toLowerCase()}Count`] = 0;
        });
        acc.push(project);
      }

      if (validTypes.includes(row.premise_type)) {
        project[`${row.premise_type.toLowerCase()}Count`] = parseInt(
          row.premise_count,
          10,
        );
      }

      return acc;
    }, []);

    return formattedResult;
  }

  async createProjects(
    createProjectDto: CreateProjectDto,
  ): Promise<CreateProjectDto | HttpException> {
    try {
      const newProject = await this.projectsRepository.save(createProjectDto);

      return newProject;
    } catch (error) {
      return new HttpException('Something went wrong', 500);
    }
  }

  async getOneProject(id: Uuid): Promise<ProjectEntity | null> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: {
        clients: true,
        buildings: true,
      },
    });
    return project;
  }

  async getUniqueEndDates(): Promise<Date[]> {
    const uniqueEndDates = await this.projectsRepository
      .createQueryBuilder('project')
      .select('DISTINCT project.end_date', 'end_date')
      .getRawMany();

    return uniqueEndDates.map((entry) => entry.end_date);
  }

  async updateProject(
    updateProjectDto: UpdateProjectDto,
  ): Promise<HttpException | ProjectEntity> {
    try {
      const project = await this.getOneProject(updateProjectDto.projectId);

      if (!project) return new HttpException('Project not found ', 404);

      const updatedProject = await this.projectsRepository.merge(
        project,
        updateProjectDto,
      );
      await this.projectsRepository.save(updatedProject);

      return updatedProject;
    } catch (error) {
      return new HttpException('Something went wrong', 500);
    }
  }

  async deleteProject(id: Uuid): Promise<ProjectEntity | HttpException> {
    try {
      const project = await this.getOneProject(id);

      if (!project) return new HttpException('Project not found ', 404);

      await this.projectsRepository.remove(project);
      return project;
    } catch (error) {
      return new HttpException('Something went wrong', 500);
    }
  }
}
