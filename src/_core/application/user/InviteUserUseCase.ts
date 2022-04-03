import { ValidationException } from '../../domain/exception/ValidationException';
import { ValidatorService } from '../../domain/services/validations/ValidatorService';
import { UserRepository } from '../../domain/services/repositories/UserRepository';
import { ConflictException } from '../../domain/exception/ConflictException';
import { UserService } from '../../domain/services/entityservices/UserService';
import { UsersEmailService } from '../../domain/services/email/UsersEmailService';

export class InviteUserUseCase {

  constructor(
    private validatorService: ValidatorService,
    private userRepository: UserRepository,
    private userService: UserService,
    private usersEmailService: UsersEmailService,
  ) {
  }

  public execute(email: string): boolean {

    if (!email || !this.validatorService.validateEmail(email)) {
      throw new ValidationException('Invalid email provided');
    }

    this.checkIfUserAlreadyExistsOrFail(email);

    const newUser = this.userService.buildDraftUser(email);
    this.userRepository.saveOrFail(newUser);

    this.usersEmailService.sendUserInvitationEmail(newUser);

    return true;
  }

  private checkIfUserAlreadyExistsOrFail(email: string): void {
    const existingUser = this.userRepository.findByEmail(email);

    if (!!existingUser) {
      throw new ConflictException('Already exists a user with this email');
    }
  }
}
