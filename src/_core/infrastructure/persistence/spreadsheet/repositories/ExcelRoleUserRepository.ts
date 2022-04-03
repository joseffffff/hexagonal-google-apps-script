import { RoleUserRepository } from '../../../../domain/services/repositories/RoleUserRepository';
import { RoleUser } from '../../../../domain/entities/RoleUser';
import { ExcelBaseRepository } from './ExcelBaseRepository';

export class ExcelRoleUserRepository extends ExcelBaseRepository<RoleUser> implements RoleUserRepository {
  public constructor() {
    super('role_users', values => new RoleUser(values as RoleUser));
  }

  public findByUserId(userId: string): RoleUser[] {
    return this.orm.findByColumn('userId', userId);
  }

  public findByRoleId(roleId: string): RoleUser[] {
    return this.orm.findByColumn('roleId', roleId);
  }

  public findByRoleIdAndUserId(roleId: string, userId: string): RoleUser | undefined {
    const result = this.orm.findByColumns({ roleId, userId });

    if (result.length > 0) {
      return result[0];
    }

    return undefined;
  }

  public findByUserIdIn(userIds: string[]): RoleUser[] {
    return this.orm.findByColumnIn('userId', userIds);
  }
}
