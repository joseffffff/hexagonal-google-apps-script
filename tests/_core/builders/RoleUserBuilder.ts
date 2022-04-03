import { EntityBuilder } from './EntityBuilder';
import { RoleUser } from '../../../src/_core/domain/entities/RoleUser';

export class RoleUserBuilder extends EntityBuilder<RoleUser> {
  private userId: string;
  private roleId: string;

  public build(): RoleUser {
    return new RoleUser({
      ...this.buildBaseFields(),
      roleId: this.roleId,
      userId: this.userId,
    });
  }

  public withUserId(userId: string): RoleUserBuilder {
    this.userId = userId;
    return this;
  }

  public withRoleId(roleId: string): RoleUserBuilder {
    this.roleId = roleId;
    return this;
  }

  public static instance(): RoleUserBuilder {
    return new RoleUserBuilder();
  }
}
