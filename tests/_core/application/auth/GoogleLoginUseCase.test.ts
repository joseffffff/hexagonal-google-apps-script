import { GoogleLoginUseCase } from '../../../../src/_core/application/auth/GoogleLoginUseCase';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserRepository } from '../../../../src/_core/domain/services/repositories/UserRepository';
import { AuthService } from '../../../../src/_core/domain/services/AuthService';
import { GoogleJwtValidator } from '../../../../src/_core/domain/services/GoogleJwtValidator';
import { UserService } from '../../../../src/_core/domain/services/entityservices/UserService';
import { GoogleAuthValidationResponse } from '../../../../src/_core/domain/valueobjects/GoogleAuthValidationResponse';
import { User } from '../../../../src/_core/domain/entities/User';
import { UserBuilder } from '../../builders/UserBuilder';

import faker from 'faker';
import { RoleService } from '../../../../src/_core/domain/services/entityservices/RoleService';
import { RoleBuilder } from '../../builders/RoleBuilder';
import { RoleName } from '../../../../src/_core/domain/valueobjects/RoleName';

describe('GoogleLoginUseCase test cases', () => {

  let mockUserRepository: MockProxy<UserRepository>;
  let mockAuthService: MockProxy<AuthService>;
  let mockGoogleJwtValidator: MockProxy<GoogleJwtValidator> & GoogleJwtValidator;
  let mockUserService: MockProxy<UserService> & UserService;
  let mockRoleService: MockProxy<RoleService> & RoleService;

  let useCase: GoogleLoginUseCase;

  const tokenData: GoogleAuthValidationResponse = {
    iss: '',
    sub: '',
    azp: '',
    aud: '',

    email: 'johnDoe@gmail.com',
    email_verified: true,

    at_hash: '',

    name: 'John Doe',
    picture: '<url picture>',
    given_name: 'John',
    locale: 'en',
    iat: 1234,
    exp: '',
    jti: '',
  };

  let user: User;
  const tokenValue = faker.datatype.uuid();
  const tokenExpiration = faker.date.future();

  beforeEach(() => {
    user = UserBuilder.instance().build();

    mockUserRepository = mock<UserRepository>();
    mockUserRepository.saveOrFail.mockReturnValue(user);

    mockAuthService = mock<AuthService>();
    mockAuthService.generateToken.mockReturnValue(tokenValue);
    mockAuthService.generateTokenExpiration.mockReturnValue(tokenExpiration);

    mockGoogleJwtValidator = mock<GoogleJwtValidator>();
    mockGoogleJwtValidator.validate.mockReturnValue(tokenData);

    mockUserService = mock<UserService>();
    mockUserService.getOrCreateFromTokenData.mockReturnValue(user);

    mockRoleService = mock<RoleService>();

    useCase = new GoogleLoginUseCase(
      mockUserRepository,
      mockAuthService,
      mockGoogleJwtValidator,
      mockUserService,
      mockRoleService,
    );
  });

  test('should set value to token and token expiration', () => {
    const roles = RoleBuilder.buildFromRoleNames([ RoleName.OTHER_ROLE, RoleName.CENTER_COORDINATOR ]);
    mockRoleService.getUserRoles.mockReturnValue(roles);

    const output = useCase.execute('token');

    expect(output).toBe(user);
    expect(output.roles).toBe(roles);
    expect(output.token).toBe(tokenValue);
    expect(output.tokenExpiration).toBe(tokenExpiration);
  });
});
