import { EntityBase } from './EntityBase';
import { RoleName } from '../valueobjects/RoleName';

export class Role extends EntityBase {

  public readonly name: RoleName;

  constructor(entity: Role) {
    super(entity);
    this.name = entity.name;
  }
}
