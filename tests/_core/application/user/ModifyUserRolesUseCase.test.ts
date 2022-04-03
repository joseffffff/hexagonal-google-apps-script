import { ModifyUserRolesUseCase } from '../../../../src/_core/application/user/ModifyUserRolesUseCase';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserRepository } from '../../../../src/_core/domain/services/repositories/UserRepository';
import { RoleRepository } from '../../../../src/_core/domain/services/repositories/RoleRepository';
import { RoleUserRepository } from '../../../../src/_core/domain/services/repositories/RoleUserRepository';
import { ValidationException } from '../../../../src/_core/domain/exception/ValidationException';
import { User } from '../../../../src/_core/domain/entities/User';
import { UserBuilder } from '../../builders/UserBuilder';
import { RoleName } from '../../../../src/_core/domain/valueobjects/RoleName';
import { RoleBuilder } from '../../builders/RoleBuilder';
import { RoleUser } from '../../../../src/_core/domain/entities/RoleUser';
import { RoleUserBuilder } from '../../builders/RoleUserBuilder';

describe('ModifyUserRolesUseCase test cases', () => {
  let mockUserRepository: MockProxy<UserRepository>;
  let mockRoleRepository: MockProxy<RoleRepository>;
  let mockRoleUserRepository: MockProxy<RoleUserRepository>;

  let useCase: ModifyUserRolesUseCase;

  let user: User;
  let oldRoleUsers: RoleUser[];

  beforeEach(() => {
    user = UserBuilder.instance().build();
    oldRoleUsers = RoleUserBuilder.buildMany<RoleUser>(3, { userId: user.id });

    mockUserRepository = mock<UserRepository>();
    mockUserRepository.findByIdOrFail.mockReturnValue(user);

    mockRoleRepository = mock<RoleRepository>();
    mockRoleRepository.findByNameIn
      .mockImplementation(
        (roleNames) => roleNames.map(
          roleName => RoleBuilder.instance()
            .withRoleName(roleName)
            .build(),
        ),
      );

    mockRoleUserRepository = mock<RoleUserRepository>();
    mockRoleUserRepository.findByUserId
      .calledWith(user.id)
      .mockReturnValue(oldRoleUsers);

    useCase = new ModifyUserRolesUseCase(mockUserRepository, mockRoleRepository, mockRoleUserRepository);
  });

  test(
    'should throw ValidationException if undefined rolenames',
    () => expect(() => useCase.execute(undefined, '')).toThrow(ValidationException),
  );

  test(
    'should throw ValidationException if not array rolenames',
    // @ts-ignore
    () => expect(() => useCase.execute('not an array', '')).toThrow(ValidationException),
  );

  test(
    'should throw ValidationException if undefined userId',
    () => expect(() => useCase.execute([], undefined)).toThrow(ValidationException),
  );

  test('happy path', () => {
    expect(useCase.execute([
      RoleName.OTHER_ROLE,
      RoleName.SUPER_ADMIN,
    ], user.id)).toBe(true);
    expect(mockRoleUserRepository.deleteAll).toHaveBeenCalledWith(oldRoleUsers);
    expect(mockRoleUserRepository.createAll).toHaveBeenCalled();
  });
});
