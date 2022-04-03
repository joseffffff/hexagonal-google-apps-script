import { EntityBase } from '../../../domain/entities/EntityBase';

export class Job extends EntityBase {
  payload: string;

  public constructor(entity: Job) {
    super(entity);
    this.payload = entity.payload;
  }
}
