import { Repository } from '../../../domain/services/repositories/Repository';
import { Job } from '../entities/Job';
import { Orm } from '../../persistence/spreadsheet/orm/Orm';
import { Env } from '../../../../env';
import { NotFoundException } from '../../../domain/exception/NotFoundException';
import { InternalServerErrorException } from '../../../domain/exception/InternalServerErrorException';

export class ExcelJobRepository implements Repository<Job> {
  constructor(
    private orm: Orm<Job> = new Orm<Job>(
      Env.DATABASE_ID,
      'jobs',
      (values) => new Job(values as Job),
    ),
  ) {
  }

  public delete(entity: Job): boolean {
    return this.orm.delete(entity);
  }

  public findAll(): Job[] {
    return this.orm.findAll();
  }

  public findById(id: string): Job {
    return this.orm.findById(id);
  }

  public save(entity: Job): boolean {
    return this.orm.save(entity);
  }

  public createAll(entities: Job[]): boolean {
    return this.orm.createAll(entities);
  }

  public deleteAll(entities: Job[]): boolean {
    return this.orm.deleteAll(entities);
  }

  public findByIdIn(ids: string[]): Job[] {
    return this.orm.findByColumnIn('id', ids);
  }

  public findByIdOrFail(id: string): Job {
    const job = this.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    return job;
  }

  public saveOrFail(entity: Job): Job {
    const result = this.save(entity);

    if (!result) {
      throw new InternalServerErrorException();
    }

    return entity;
  }

  public findByIdInAsMap(ids: string[], key?: string): Map<string, Job> {
    const map = new Map<string, Job>();

    const entities = this.findByIdIn(ids);
    // @ts-ignore
    entities.forEach(entity => map.set(entity[key], entity));

    return map;
  }

  public updateAll(entities: Job[]): boolean {
    return this.orm.updateAll(entities);
  }
}
