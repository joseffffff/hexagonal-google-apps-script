import { InviteUserUseCase } from '../../../../src/_core/application/user/InviteUserUseCase';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserRepository } from '../../../../src/_core/domain/services/repositories/UserRepository';
import { ValidatorService } from '../../../../src/_core/domain/services/validations/ValidatorService';
import { ValidationException } from '../../../../src/_core/domain/exception/ValidationException';
import { UserBuilder } from '../../builders/UserBuilder';
import { ConflictException } from '../../../../src/_core/domain/exception/ConflictException';
import { User } from '../../../../src/_core/domain/entities/User';
import { UserService } from '../../../../src/_core/domain/services/entityservices/UserService';
import { UsersEmailService } from '../../../../src/_core/domain/services/email/UsersEmailService';

import faker from 'faker';

describe('InviteUserUseCase test cases', () => {

  let mockUserRepository: MockProxy<UserRepository>;
  let validationService: MockProxy<ValidatorService> & ValidatorService;

  let userService: UserService;

  let mockUsersEmailService: MockProxy<UsersEmailService> & UsersEmailService;

  let useCase: InviteUserUseCase;

  beforeEach(() => {
    mockUserRepository = mock<UserRepository>();
    mockUserRepository.findByEmail.mockReturnValue(undefined);
    mockUserRepository.saveOrFail.mockImplementation(user => user);

    validationService = mock<ValidatorService>();
    validationService.validateEmail.mockReturnValue(true);

    mockUsersEmailService = mock<UsersEmailService>();

    userService = new UserService(mockUserRepository);

    useCase = new InviteUserUseCase(validationService, mockUserRepository, userService, mockUsersEmailService);
  });

  test(
    'should throw validation exception if undefined email',
    () => expect(() => useCase.execute(undefined)).toThrow(ValidationException),
  );

  test(
    'should throw validation exception if invalid email',
    () => {
      validationService.validateEmail.mockReturnValue(false);
      expect(() => useCase.execute('invalid@@email')).toThrow(ValidationException);
    },
  );

  test('should throw conflict exception if email already in use', () => {
    const email = faker.internet.email();

    const existingUser = UserBuilder.instance().withEmail(email).build();

    mockUserRepository.findByEmail.mockReturnValue(existingUser);

    expect(() => useCase.execute(email)).toThrow(ConflictException);
  });

  test('should create a user with that email and send an email to that email address', () => {
    const email = faker.internet.email();

    const result = useCase.execute(email);

    expect(result).toBe(true);
    expect(mockUserRepository.saveOrFail).toHaveBeenCalled();
    expect(mockUsersEmailService.sendUserInvitationEmail).toHaveBeenCalled();

    const createdUser: User = mockUserRepository.saveOrFail.mock.calls[0][0];
    expect(createdUser.email).toBe(email);
  });
});
