import { ListUsersUseCase } from '../../../../src/_core/application/user/ListUsersUseCase';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserRepository } from '../../../../src/_core/domain/services/repositories/UserRepository';
import { RoleUserRepository } from '../../../../src/_core/domain/services/repositories/RoleUserRepository';
import { RoleRepository } from '../../../../src/_core/domain/services/repositories/RoleRepository';
import { RoleBuilder } from '../../builders/RoleBuilder';
import { UserBuilder } from '../../builders/UserBuilder';
import { User } from '../../../../src/_core/domain/entities/User';
import { Role } from '../../../../src/_core/domain/entities/Role';
import { RoleUser } from '../../../../src/_core/domain/entities/RoleUser';
import { RoleUserBuilder } from '../../builders/RoleUserBuilder';
import { RoleService } from '../../../../src/_core/domain/services/entityservices/RoleService';

describe('ListUsersUseCases test cases', () => {

  let mockUserRepository: MockProxy<UserRepository>;
  let mockRoleUserRepository: MockProxy<RoleUserRepository>;
  let mockRoleRepository: MockProxy<RoleRepository>;
  let roleService: RoleService;

  let users: User[];
  let roles: Role[];
  let roleUsers: RoleUser[];

  let useCase: ListUsersUseCase;

  beforeEach(() => {
    users = UserBuilder.buildMany<User>(20);
    roles = RoleBuilder.findAll();

    roleUsers = users.map(
      user =>
        RoleUserBuilder.instance()
          .withUserId(user.id)
          .withRoleId(roles[Math.floor(Math.random() * roles.length)].id)
          .build(),
    );

    mockUserRepository = mock<UserRepository>();
    mockUserRepository.findAll.mockReturnValue(users);

    mockRoleUserRepository = mock<RoleUserRepository>();
    mockRoleUserRepository.findByUserIdIn.mockReturnValue(roleUsers);

    mockRoleRepository = mock<RoleRepository>();
    mockRoleRepository.findAll.mockReturnValue(roles);

    roleService = new RoleService(mockRoleRepository, mockRoleUserRepository);

    useCase = new ListUsersUseCase(
      mockUserRepository,
      roleService,
    );
  });

  test('should return same as repository, with their roles', () => {
    const result = useCase.execute();

    expect(result.length).toBe(users.length);

    const userRolesFromUsers = users.flatMap(
      user => user.roles.map(
        role => ({ userId: user.id, roleId: role.id }),
      ),
    );

    expect(userRolesFromUsers).toStrictEqual(roleUsers.map(roleUser => ({
      userId: roleUser.userId,
      roleId: roleUser.roleId,
    })));
  });
});
