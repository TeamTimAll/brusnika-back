// import { type ICommand, type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { CitiesEntity } from '../cities.entity';
// import { Uuid } from 'boilerplate.polyfill';

// export class GetCitiesQuery implements ICommand {
//   constructor(public readonly userId: Uuid) {}
// }

// @QueryHandler(GetCitiesQuery)
// export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
//   constructor(
//     @InjectRepository(CitiesEntity)
//     private CitiesRepository: Repository<CitiesEntity>,
//   ) {}

//   async execute(query: GetCitiesQuery) {
//     return this.CitiesRepository.findBy({
//       userId: query.userId as never,
//     });
//   }
// }
