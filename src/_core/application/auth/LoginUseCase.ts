import { UserRepository } from '../../domain/services/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { HashingService } from '../../domain/services/HashingService';
import { AuthService } from '../../domain/services/AuthService';
import { ValidationException } from '../../domain/exception/ValidationException';
import { AuthenticationException } from '../../domain/exception/AuthenticationException';
import { RoleService } from '../../domain/services/entityservices/RoleService';

export class LoginUseCase {
  public constructor(
    private userRepository: UserRepository,
    private hashingService: HashingService,
    private authService: AuthService,
    private roleService: RoleService,
  ) {
  }

  public execute(email: string, password: string): User {

    if (!email || !password) {
      throw new ValidationException('Email or password missing.');
    }

    const user: User | undefined = this.userRepository.findByEmail(email);

    if (!user || !!user.isGoogleUser || !!user.isDraft) {
      throw new AuthenticationException('Login Failed.');
    }

    const isGoodPassword = this.hashingService.check(password, user.password);

    if (!isGoodPassword) {
      throw new AuthenticationException('Login Failed.');
    }

    user.token = this.authService.generateToken();
    user.tokenExpiration = this.authService.generateTokenExpiration();

    user.setRoles(this.roleService.getUserRoles(user));

    return this.userRepository.saveOrFail(user);
  }
}
