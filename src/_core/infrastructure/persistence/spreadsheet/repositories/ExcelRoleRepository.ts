import { RoleRepository } from '../../../../domain/services/repositories/RoleRepository';
import { Role } from '../../../../domain/entities/Role';
import { RoleName } from '../../../../domain/valueobjects/RoleName';
import { ExcelBaseRepository } from './ExcelBaseRepository';

export class ExcelRoleRepository extends ExcelBaseRepository<Role> implements RoleRepository {
  public constructor() {
    super('roles', values => new Role(values as Role));
  }

  public findByName(roleName: RoleName): Role | undefined {
    return this.findAll().find(role => role.name === roleName);
  }

  public findByNameIn(roleNames: RoleName[]): Role[] {
    return this.orm.findByColumnIn('name', roleNames);
  }
}
