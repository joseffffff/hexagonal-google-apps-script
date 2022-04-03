export interface Repository<T> {
  findById(id: string): T | undefined;
  findByIdIn(ids: string[]): T[];
  findByIdOrFail(id: string): T;
  findAll(): T[];
  save(entity: T): boolean;
  saveOrFail(entity: T): T;
  delete(entity: T): boolean;
  createAll(entities: T[]): boolean;
  deleteAll(entities: T[]): boolean;
  findByIdInAsMap(ids: string[], key?: string): Map<string, T>;
  updateAll(entities: T[]): boolean;
}
