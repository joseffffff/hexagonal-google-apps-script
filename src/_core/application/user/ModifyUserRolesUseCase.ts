import { UserRepository } from '../../domain/services/repositories/UserRepository';
import { RoleRepository } from '../../domain/services/repositories/RoleRepository';
import { RoleUserRepository } from '../../domain/services/repositories/RoleUserRepository';
import { ValidationException } from '../../domain/exception/ValidationException';
import { RoleName } from '../../domain/valueobjects/RoleName';
import { RoleUser } from '../../domain/entities/RoleUser';

export class ModifyUserRolesUseCase {
  public constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private roleUserRepository: RoleUserRepository,
  ) {
  }

  public execute(roleNames: RoleName[], userId: string): boolean {

    if (!roleNames || !userId || !Array.isArray(roleNames)) {
      throw new ValidationException('Something\'s missing');
    }

    const user = this.userRepository.findByIdOrFail(userId);
    const roles = this.roleRepository.findByNameIn(roleNames);

    const roleUsers = this.roleUserRepository.findByUserId(user.id);

    this.roleUserRepository.deleteAll(roleUsers);

    const newRoleUsers = roles.map(role => new RoleUser({ roleId: role.id, userId: user.id }));

    this.roleUserRepository.createAll(newRoleUsers);

    return true;
  }
}
