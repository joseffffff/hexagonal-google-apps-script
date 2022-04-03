import { EntityBase } from '../../entities/EntityBase';

export class ArrayHelper {

  public static toUniqueEntityList<T extends EntityBase>(entities: T[]): T[] {
    return [
      ...new Map(entities.map(entity => [ entity.id, entity ])).values(),
    ];
  }

  public static toUniqueList<T>(values: T[]): T[] {
    return Array.from(new Set(values))
  }
}
