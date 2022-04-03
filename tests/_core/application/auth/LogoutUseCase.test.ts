import { LogoutUseCase } from '../../../../src/_core/application/auth/LogoutUseCase';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserRepository } from '../../../../src/_core/domain/services/repositories/UserRepository';
import { User } from '../../../../src/_core/domain/entities/User';
import { UserBuilder } from '../../builders/UserBuilder';

describe('LogoutUseCase test cases', () => {
  let mockUserRepository: MockProxy<UserRepository>;
  let useCase: LogoutUseCase;

  let user: User;

  beforeEach(() => {
    mockUserRepository = mock<UserRepository>();
    mockUserRepository.save.mockReturnValue(true);
    useCase = new LogoutUseCase(mockUserRepository);
    user = UserBuilder.instance().build();
  });

  test('should set token and token expiration to null', () => {
    expect(useCase.execute(user)).toBe(true);
    expect(user.token).toBeNull();
    expect(user.tokenExpiration).toBeNull();
  })
})
