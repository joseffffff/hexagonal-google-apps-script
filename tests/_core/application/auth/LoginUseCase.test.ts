import { mock, MockProxy } from 'jest-mock-extended';
import { UserRepository } from '../../../../src/_core/domain/services/repositories/UserRepository';
import { HashingService } from '../../../../src/_core/domain/services/HashingService';
import { AuthService } from '../../../../src/_core/domain/services/AuthService';
import { LoginUseCase } from '../../../../src/_core/application/auth/LoginUseCase';
import { ValidationException } from '../../../../src/_core/domain/exception/ValidationException';
import { AuthenticationException } from '../../../../src/_core/domain/exception/AuthenticationException';
import { UserBuilder } from '../../builders/UserBuilder';
import { RoleService } from '../../../../src/_core/domain/services/entityservices/RoleService';
import { RoleBuilder } from '../../builders/RoleBuilder';
import { RoleName } from '../../../../src/_core/domain/valueobjects/RoleName';

describe('Login use case tests', () => {

  let mockUserRepository: MockProxy<UserRepository>;
  let mockHashingService: MockProxy<HashingService>;
  let mockAuthService: MockProxy<AuthService>;
  let mockRoleService: MockProxy<RoleService> & RoleService;

  let useCase: LoginUseCase;

  beforeEach(() => {
    mockUserRepository = mock<UserRepository>();

    mockHashingService = mock<HashingService>();
    mockHashingService.check.mockReturnValue(true);

    mockAuthService = mock<AuthService>();

    mockRoleService = mock<RoleService>();

    useCase = new LoginUseCase(mockUserRepository, mockHashingService, mockAuthService, mockRoleService);
  });

  test('should throw Validation Exception if undefined email', () => {
    expect(() => useCase.execute(undefined, 'pass')).toThrow(ValidationException);
  });

  test('should throw Validation Exception if undefined password', () => {
    expect(() => useCase.execute('email@email.com', undefined)).toThrow(ValidationException);
  });

  test('should throw Authentication exception if no user found with email', () => {
    mockUserRepository.findByEmail.mockReturnValue(undefined);
    expect(() => useCase.execute('email@email.com', 'password')).toThrow(AuthenticationException);
  });

  test('should throw Authentication exception if user found is a google user', () => {
    const user = UserBuilder.instance().withIsGoogleUser(true).build();
    mockUserRepository.findByEmail.mockReturnValue(user);
    expect(() => useCase.execute(user.email, 'randompassword')).toThrow(AuthenticationException);
  });

  test('should throw Authentication exception if user found is a draft', () => {
    const user = UserBuilder.instance().withIsDraft(true).build();
    mockUserRepository.findByEmail.mockReturnValue(user);
    expect(() => useCase.execute(user.email, 'randompassword')).toThrow(AuthenticationException);
  });

  test('should throw authentication exception if is password does not match', () => {
    const user = UserBuilder.instance().build();
    mockUserRepository.findByEmail.mockReturnValue(user);

    mockHashingService.check.mockReturnValue(false);
    expect(() => useCase.execute(user.email, 'invalidpassword')).toThrow(AuthenticationException);
  });

  test('happy path', () => {
    const user = UserBuilder.instance().build();
    mockUserRepository.findByEmail.mockReturnValue(user);
    mockUserRepository.saveOrFail.mockReturnValue(user);

    const roles = RoleBuilder.buildFromRoleNames([ RoleName.NET_COORDINATOR, RoleName.OTHER_ROLE ]);
    mockRoleService.getUserRoles.mockReturnValue(roles);

    const loggedUser = useCase.execute(user.email, 'validPassword');

    expect(loggedUser).toBe(user);
    expect(loggedUser.roles).toStrictEqual(roles);
  });
});
