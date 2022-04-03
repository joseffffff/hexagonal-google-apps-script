import { User } from '../../../domain/entities/User';
import { BaseRequest } from '../requests/BaseRequest';
import { ListUsersUseCase } from '../../../application/user/ListUsersUseCase';
import { EmailRequest } from '../requests/common/EmailRequest';
import { BooleanResource } from '../resources/common/BooleanResource';
import { InviteUserUseCase } from '../../../application/user/InviteUserUseCase';
import { UserRoleRequest } from '../requests/common/UserRoleRequest';
import { ModifyUserRolesUseCase } from '../../../application/user/ModifyUserRolesUseCase';
import { SimpleUserResource } from '../resources/user/SimpleUserResource';

export class UserController {
  public constructor(
    private listUsersUseCase: ListUsersUseCase,
    private inviteUserUseCase: InviteUserUseCase,
    private modifyUserRolesUseCase: ModifyUserRolesUseCase,
  ) {
  }

  public listUsers(request: BaseRequest, loggedUser: User): SimpleUserResource[] {
    const users = this.listUsersUseCase.execute();
    return users.map(user => new SimpleUserResource(user));
  }

  public inviteUser(request: EmailRequest, user: User): BooleanResource {
    const success = this.inviteUserUseCase.execute(request.email);
    return new BooleanResource(success);
  }

  public modifyUserRoles(request: UserRoleRequest): BooleanResource {
    const success = this.modifyUserRolesUseCase.execute(request.roleNames, request.userId);
    return new BooleanResource(success);
  }
}
