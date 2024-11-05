// import { type ICommand, type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { AgenciesEntity } from '../agencies.entity';
// import { Uuid } from 'boilerplate.polyfill';

// export class GetAgenciesQuery implements ICommand {
//   constructor(public readonly userId: string) {}
// }

// @QueryHandler(GetAgenciesQuery)
// export class GetAgenciesHandler implements IQueryHandler<GetAgenciesQuery> {
//   constructor(
//     @InjectRepository(AgenciesEntity)
//     private AgenciesRepository: Repository<AgenciesEntity>,
//   ) {}

//   async execute(query: GetAgenciesQuery) {
//     return this.AgenciesRepository.findBy({
//       userId: query.userId,
//     });
//   }
// }
