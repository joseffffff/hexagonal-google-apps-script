import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/services/repositories/UserRepository';
import { ValidatorService } from '../../domain/services/validations/ValidatorService';
import { HashingService } from '../../domain/services/HashingService';
import { ValidationException } from '../../domain/exception/ValidationException';
import { ConflictException } from '../../domain/exception/ConflictException';

export class RegisterUseCase {

  public constructor(
    private userRepository: UserRepository,
    private validatorService: ValidatorService,
    private hashingService: HashingService,
  ) {
  }

  public execute(name: string, email: string, password: string): User {

    if (!name || !email || !password) {
      throw new ValidationException('Name, email or password missing.');
    }

    const optionalUser = this.userRepository.findByEmail(email);

    if (!!optionalUser) {
      throw new ConflictException('Already exists a user with this email.');
    }

    const validEmail = this.validatorService.validateEmail(email);

    if (!validEmail) {
      throw new ValidationException('Invalid Email.');
    }

    const validPassword = this.validatorService.validatePassword(password);

    if (!validPassword) {
      throw new ValidationException('Invalid Password.');
    }

    const hashedPassword = this.hashingService.hash(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    this.userRepository.saveOrFail(user);

    return user;
  }
}
