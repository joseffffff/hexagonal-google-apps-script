import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/services/repositories/UserRepository';
import { RoleService } from '../../domain/services/entityservices/RoleService';

export class ListUsersUseCase {

  public constructor(
    private userRepository: UserRepository,
    private roleService: RoleService,
  ) {
  }

  public execute(): User[] {
    const users = this.userRepository.findAll();
    return this.roleService.setUserRoles(users)
  }
}
