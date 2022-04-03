import { Repository } from './Repository';
import { RoleUser } from '../../entities/RoleUser';

export interface RoleUserRepository extends Repository<RoleUser> {
  findByUserId(userId: string): RoleUser[];
  findByRoleId(roleId: string): RoleUser[];
  findByRoleIdAndUserId(roleId: string, userId: string): RoleUser | undefined;
  findByUserIdIn(usersIds: string[]): RoleUser[];
}
