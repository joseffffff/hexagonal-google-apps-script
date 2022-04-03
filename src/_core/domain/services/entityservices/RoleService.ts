import { RoleName } from '../../valueobjects/RoleName';
import { User } from '../../entities/User';
import { RoleRepository } from '../repositories/RoleRepository';
import { RoleUserRepository } from '../repositories/RoleUserRepository';
import { Role } from '../../entities/Role';
import { RoleUser } from '../../entities/RoleUser';
import { ConflictException } from '../../exception/ConflictException';

export class RoleService {

  public constructor(
    private readonly roleRepository: RoleRepository,
    private readonly roleUserRepository: RoleUserRepository,
  ) {
  }

  public assignRoleIfNeeded(roleName: RoleName, user: User): void {
    try {
      this.assignRole(roleName, user);
    } catch (e) {
      // We do nothing if the user already has the role
    }
  }

  public assignRole(roleName: RoleName, user: User): void {

    const role: Role = this.roleRepository.findByName(roleName);

    const userHasRole: boolean = this.userHasRole(role, user);

    if (userHasRole) {
      throw new ConflictException('This user already have this role.');
    }

    const newRoleUser = new RoleUser({
      roleId: role.id,
      userId: user.id,
    });

    this.roleUserRepository.saveOrFail(newRoleUser);
  }

  public userHasRole(role: Role, user: User): boolean {
    return !!this.roleUserRepository.findByRoleIdAndUserId(role.id, user.id);
  }

  public setUserRoles(users: User[]): User[] {
    const rolesMap = this.buildRolesAsMap();

    const roleUsers = this.roleUserRepository.findByUserIdIn(users.map(user => user.id));

    roleUsers.forEach(roleUser => {
      const user: User = users.find(u => u.id === roleUser.userId);
      user.addRole(rolesMap.get(roleUser.roleId));
    });

    return users;
  }

  private buildRolesAsMap(): Map<string, Role> {
    const map = new Map<string, Role>();

    const roles = this.roleRepository.findAll();
    roles.forEach(role => map.set(role.id, role));

    return map;
  }

  public getUserRoles(user: User): Role[] {
    const roleUsers = this.roleUserRepository.findByUserId(user.id);
    return this.roleRepository.findByIdIn(roleUsers.map(roleUser => roleUser.roleId));
  }
}
