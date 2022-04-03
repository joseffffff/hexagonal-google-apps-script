import { Repository } from '../../../../domain/services/repositories/Repository';
import { Orm } from '../orm/Orm';
import { Env } from '../../../../../env';
import { NotFoundException } from '../../../../domain/exception/NotFoundException';
import { InternalServerErrorException } from '../../../../domain/exception/InternalServerErrorException';
import { EntityBase } from '../../../../domain/entities/EntityBase';
import { Casting } from '../orm/casts/Casting';

export class ExcelBaseRepository<T extends EntityBase> implements Repository<T> {

  protected orm: Orm<T>;
  private readonly table: string;

  protected constructor(
    table: string,
    instantiator: (values: object) => T,
    casting: Casting = {},
    databaseId: string = Env.DATABASE_ID,
  ) {
    this.orm = new Orm<T>(databaseId, table, instantiator, casting);
    this.table = table;
  }

  public delete(entity: T): boolean {
    return this.orm.delete(entity);
  }

  public findAll(): T[] {
    return this.orm.findAll();
  }

  public findById(id: string): T | undefined {
    return this.orm.findById(id);
  }

  public findByIdOrFail(id: string): T {
    const entity = this.findById(id);

    if (!entity) {
      throw new NotFoundException(`Entity not found with id ${id} in table ${this.table}`);
    }

    return entity;
  }

  public save(entity: T): boolean {
    return this.orm.save(entity);
  }

  public saveOrFail(entity: T): T {
    const result = this.save(entity);

    if (!result) {
      throw new InternalServerErrorException(`Error on save entity with id ${entity.id} in table ${this.table}`);
    }

    return entity;
  }

  public deleteAll(entities: T[]): boolean {
    return this.orm.deleteAll(entities);
  }

  public createAll(entities: T[]): boolean {
    return this.orm.createAll(entities);
  }

  public findByIdIn(ids: string[]): T[] {
    return this.orm.findByColumnIn('id', ids);
  }

  public findByIdInAsMap(ids: string[], key: string = 'id'): Map<string, T> {
    const entities = this.findByIdIn(ids);
    return this.buildMap(entities, key);
  }

  protected buildMap(entities: T[], key: string): Map<string, T> {
    // @ts-ignore
    return new Map(entities.map(entity => [ entity[key], entity ]));
  }

  public updateAll(entities: T[]): boolean {
    return this.orm.updateAll(entities);
  }
}
