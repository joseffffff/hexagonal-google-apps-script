export interface IEntityBase {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class EntityBase implements IEntityBase {

  public id?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  protected constructor(entity: IEntityBase) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
