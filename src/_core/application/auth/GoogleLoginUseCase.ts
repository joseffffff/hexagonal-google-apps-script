import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/services/repositories/UserRepository';
import { AuthService } from '../../domain/services/AuthService';
import { GoogleJwtValidator } from '../../domain/services/GoogleJwtValidator';
import { UserService } from '../../domain/services/entityservices/UserService';
import { RoleService } from '../../domain/services/entityservices/RoleService';

export class GoogleLoginUseCase {

  public constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private googleJwtValidator: GoogleJwtValidator,
    private userService: UserService,
    private roleService: RoleService,
  ) {
  }

  public execute(token: string): User {
    const tokenData = this.googleJwtValidator.validate(token);

    const user: User = this.userService.getOrCreateFromTokenData(tokenData);

    user.token = this.authService.generateToken();
    user.tokenExpiration = this.authService.generateTokenExpiration();

    this.userRepository.saveOrFail(user);

    user.setRoles(this.roleService.getUserRoles(user));

    return user;
  }
}
