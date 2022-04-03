import { EntityBase } from './EntityBase';

export class RoleUser extends EntityBase {

  public readonly roleId: string;
  public readonly userId: string;

  constructor(entity: RoleUser) {
    super(entity);
    this.roleId = entity.roleId;
    this.userId = entity.userId;
  }
}
