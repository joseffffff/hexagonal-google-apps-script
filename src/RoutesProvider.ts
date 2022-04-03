import { HttpMethod } from './_core/infrastructure/http';
import { ApiAction } from './ApiAction';
import { RoleName } from './_core/domain/valueobjects/RoleName';
import { Route } from './_core/infrastructure/http/Route';

export class RoutesProvider {
  public routes(): Route[] {
    return [
      // Auth routes
      this.post(ApiAction.LOGIN, 'AuthController', 'login', false),
      this.post(ApiAction.GOOGLE_LOGIN, 'AuthController', 'googleLogin', false),
      this.post(ApiAction.REGISTER, 'AuthController', 'register', false),
      this.post(ApiAction.LOGOUT, 'AuthController', 'logout', true),
      this.get(ApiAction.ME, 'AuthController', 'me', true),

      // Users routes
      this.get(ApiAction.USERS_LIST, 'UserController', 'listUsers', true, [
        RoleName.OTHER_ROLE,
      ]),
      this.post(ApiAction.USERS_INVITE, 'UserController', 'inviteUser', true, [
        RoleName.OTHER_ROLE,
      ]),
      this.post(ApiAction.MODIFY_USER_ROLES, 'UserController', 'modifyUserRoles'),
    ];
  }

  private get(
    action: ApiAction,
    controller: string,
    controllerMethod: string,
    requireAuth: boolean = true,
    roles: RoleName[] = [],
  ): Route {
    return { action, requireAuth, controller, controllerMethod, method: HttpMethod.GET, roles };
  }

  private post(
    action: ApiAction,
    controller: string,
    controllerMethod: string,
    requireAuth: boolean = true,
    roles: RoleName[] = [],
  ): Route {
    return { action, requireAuth, controller, controllerMethod, method: HttpMethod.POST, roles };
  }
}
