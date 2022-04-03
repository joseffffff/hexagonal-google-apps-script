import { EntityBase, IEntityBase } from '../../../src/_core/domain/entities/EntityBase';

import faker from 'faker';

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export abstract class EntityBuilder<T extends EntityBase> {
  protected id: string = faker.datatype.uuid();
  protected createdAt: Date = faker.date.past();
  protected updatedAt: Date = faker.date.past();

  // tslint:disable-next-line:no-any
  static instance(): any {
    throw new Error();
  }

  public abstract build(): T;

  public static buildOne<E>(): E {
    return this.instance().build();
  }

  public static buildMany<E extends EntityBase>(
    n: number,
    columns: { [ Key in keyof E ]?: PropType<E, Key> } = {},
  ): E[] {
    const result = [];

    for (let i = 0; i < n; i++) {
      const entity = this.instance().build();

      Object.keys(columns).forEach(key => {
        // @ts-ignore
        entity[key] = columns[key];
      });

      result.push(entity);
    }

    return result;
  }

  protected buildBaseFields(): IEntityBase {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public withId(id: string): this {
    this.id = id;
    return this;
  }

  public withEmptyId(): this {
    this.id = undefined;
    return this;
  }

  public withEmptyTimestamps(): this {
    this.createdAt = undefined;
    this.updatedAt = undefined;
    return this;
  }

  public withCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  public withUpdatedAt(updatedAt: Date): this {
    this.updatedAt = updatedAt;
    return this;
  }

  public static generateObjectArray<ArrayType extends object>(
    structure: { [x: string]: string },
    maxLength: number = 10,
  ): ArrayType[] {

    const result: ArrayType[] = [];

    const length = this.generateRandomNumber(maxLength);

    for (let i = 0; i < length; i++) {
      // @ts-ignore
      const newObject: ArrayType = {};

      Object.keys(structure).forEach(structureKey => {
        // @ts-ignore
        newObject[structureKey] = this.generateValueFromType(structure[structureKey]);
      });

      result.push(newObject);
    }

    return result;
  }

  public static generateRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private static generateValueFromType(type: string): string | number {
    switch (type) {
      case 'string':
        return faker.lorem.paragraph();
      case 'number':
        return faker.datatype.number();
      default:
        return faker.lorem.paragraph();
    }
  }

  public static randomItemOfList<E>(list: E[]): E {
    return list[Math.floor(Math.random() * list.length)];
  }

  public static generateUUIDs(uuidQuantity: number): string[] {
    const uuids: string[] = [];

    for (let i = 0; i < uuidQuantity; i++) {
      uuids.push(faker.datatype.uuid());
    }

    return uuids;
  }

  public static buildManyByColumnValues<E>(values: unknown[], column: string): E[] {
    return values.map(value => {
      const entity = this.instance().build();
      entity[column] = value;
      return entity;
    });
  }
}
