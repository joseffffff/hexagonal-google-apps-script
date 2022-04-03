import { EntityBuilder } from './EntityBuilder';
import { Role } from '../../../src/_core/domain/entities/Role';
import { RoleName } from '../../../src/_core/domain/valueobjects/RoleName';

export class RoleBuilder extends EntityBuilder<Role> {

  private roleName: RoleName;

  private constructor() {
    super();
    this.roleName = this.randomRoleName();
  }

  public build(): Role {
    return new Role({
      ...this.buildBaseFields(),
      name: this.roleName,
    });
  }

  private randomRoleName(): RoleName {
    const values: RoleName[] = Object.keys(RoleName).map(key => RoleName[key as RoleName]);
    return values[Math.floor(Math.random() * values.length)];
  }

  public static findAll(): Role[] {
    const values: RoleName[] = Object.keys(RoleName).map(key => RoleName[key as RoleName]);

    return values.map(
      roleName => RoleBuilder
        .instance()
        .withRoleName(roleName)
        .build(),
    );
  }

  public withRoleName(roleName: RoleName): RoleBuilder {
    this.roleName = roleName;
    return this;
  }

  public static instance(): RoleBuilder {
    return new RoleBuilder();
  }

  public static buildFromRoleNames(roleNames: RoleName[]): Role[] {
    return roleNames.map(roleName => RoleBuilder.instance().withRoleName(roleName).build());
  }
}
