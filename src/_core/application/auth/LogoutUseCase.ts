import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/services/repositories/UserRepository';

export class LogoutUseCase {

  public constructor(
    private userRepository: UserRepository,
  ) {
  }

  public execute(user: User): boolean {
    user.token = null;
    user.tokenExpiration = null;
    return this.userRepository.save(user);
  }
}
