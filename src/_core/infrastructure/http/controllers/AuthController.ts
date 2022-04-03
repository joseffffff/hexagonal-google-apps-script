import { LoginRequest } from '../requests/auth/LoginRequest';
import { LoginUseCase } from '../../../application/auth/LoginUseCase';
import { RegisterRequest } from '../requests/auth/RegisterRequest';
import { RegisterUseCase } from '../../../application/auth/RegisterUseCase';
import { UserResource } from '../resources/user/UserResource';
import { BaseRequest } from '../requests/BaseRequest';
import { User } from '../../../domain/entities/User';
import { BooleanResource } from '../resources/common/BooleanResource';
import { LogoutUseCase } from '../../../application/auth/LogoutUseCase';
import { GoogleLoginRequest } from '../requests/auth/GoogleLoginRequest';
import { GoogleLoginUseCase } from '../../../application/auth/GoogleLoginUseCase';

export class AuthController {

  public constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private logoutUseCase: LogoutUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
  ) {
  }

  public login(request: LoginRequest): UserResource {
    const user = this.loginUseCase.execute(request.email, request.password);
    return new UserResource(user);
  }

  public googleLogin(request: GoogleLoginRequest): UserResource {
    const user = this.googleLoginUseCase.execute(request.googleToken);
    return new UserResource(user);
  }

  public register(request: RegisterRequest): UserResource {
    const { name, email, password } = request;
    const user = this.registerUseCase.execute(name, email, password);
    return new UserResource(user);
  }

  public me(request: BaseRequest, user: User): UserResource {
    return new UserResource(user);
  }

  public logout(request: BaseRequest, user: User): BooleanResource {
    const result = this.logoutUseCase.execute(user);
    return new BooleanResource(result);
  }
}
