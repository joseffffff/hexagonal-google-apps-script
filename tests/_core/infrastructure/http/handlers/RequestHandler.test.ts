import { HttpExecutionsReporter, HttpMethod, RequestHandler } from '../../../../../src/_core/infrastructure/http';
import { RequestBuilder } from '../../../../../src/_core/infrastructure/http/handlers/RequestBuilder';
import { mock, MockProxy } from 'jest-mock-extended';
import { RoutesProvider } from '../../../../../src/RoutesProvider';
import { GeneralFactory } from '../../../../../src/_core/infrastructure/factories/GeneralFactory';
import { UserRepository } from '../../../../../src/_core/domain/services/repositories/UserRepository';
import { LoggingService } from '../../../../../src/_core/domain/services/LoggingService';
import { RoleService } from '../../../../../src/_core/domain/services/entityservices/RoleService';
import { BaseRequest } from '../../../../../src/_core/infrastructure/http/requests/BaseRequest';
import { NoActionResource } from '../../../../../src/_core/infrastructure/http/resources/common/NoActionResource';
import { HttpCode } from '../../../../../src/_core/infrastructure/http/HttpCode';
import { BaseResource } from '../../../../../src/_core/infrastructure/http/resources/BaseResource';
import { ExceptionResource } from '../../../../../src/_core/infrastructure/http/resources/common/ExceptionResource';
import { ApiAction } from '../../../../../src/ApiAction';
import { BooleanResource } from '../../../../../src/_core/infrastructure/http/resources/common/BooleanResource';
import { User } from '../../../../../src/_core/domain/entities/User';
import { UserBuilder } from '../../../builders/UserBuilder';
import { RoleName } from '../../../../../src/_core/domain/valueobjects/RoleName';
import { RoleBuilder } from '../../../builders/RoleBuilder';
import { UserResource } from '../../../../../src/_core/infrastructure/http/resources/user/UserResource';
import { SimpleUserResource } from '../../../../../src/_core/infrastructure/http/resources/user/SimpleUserResource';

describe('RequestHandler tests', () => {
  let user: User;

  let mockRequestBuilder: MockProxy<RequestBuilder>;
  let mockGeneralFactory: MockProxy<GeneralFactory> & GeneralFactory;
  let mockUserRepository: MockProxy<UserRepository> & UserRepository;
  let mockLoggingService: MockProxy<LoggingService> & LoggingService;
  let mockRoleService: MockProxy<RoleService> & RoleService;
  let mockHttpExecutionsReporter: MockProxy<HttpExecutionsReporter> & HttpExecutionsReporter;

  let requestHandler: RequestHandler;

  beforeEach(() => {
    user = UserBuilder.buildOne();

    mockRequestBuilder = mock<RequestBuilder>();
    mockGeneralFactory = mock<GeneralFactory>();

    mockUserRepository = mock<UserRepository>();
    mockUserRepository.findByToken.mockReturnValue(user);

    mockLoggingService = mock<LoggingService>();
    mockRoleService = mock<RoleService>();
    mockHttpExecutionsReporter = mock<HttpExecutionsReporter>();

    requestHandler = new RequestHandler(
      mockRequestBuilder,
      new RoutesProvider(),
      mockGeneralFactory,
      mockUserRepository,
      mockLoggingService,
      mockRoleService,
      mockHttpExecutionsReporter,
    );
  });

  test('should return a NoActionResource if no action is provided', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({} as BaseRequest);
    const resource = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.UNAUTHORIZED);
    expect(resource).toBeInstanceOf(NoActionResource);
  });

  test('Should return an exception resource with invalid action error if invalid action', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({ action: 'invalid:action' } as BaseRequest);
    // @ts-ignore
    const resource: BaseResource<ExceptionResource> = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.BAD_REQUEST);
    expect(resource.response.errorName).toBe('InvalidActionException');
  });

  test('Should return an exception resource if invalid method', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({ action: ApiAction.USERS_LIST } as BaseRequest);
    mockRequestBuilder.method.mockReturnValue(HttpMethod.POST);

    // @ts-ignore
    const resource: BaseResource<ExceptionResource> = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.METHOD_NOT_ALLOWED);
    expect(resource.response.errorName).toBe('WrongMethodException');
    expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
  });

  test('Should return an InvalidTokenException resource if no token provided', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({ action: ApiAction.USERS_LIST } as BaseRequest);
    mockRequestBuilder.method.mockReturnValue(HttpMethod.GET);

    // @ts-ignore
    const resource: BaseResource<ExceptionResource> = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.UNAUTHORIZED);
    expect(resource.response.errorName).toBe('InvalidTokenException');
    expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
  });

  test('Should return an InvalidTokenException resource if user not found with token', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({
      action: ApiAction.USERS_LIST,
      token: 'token',
    } as BaseRequest);
    mockRequestBuilder.method.mockReturnValue(HttpMethod.GET);

    mockUserRepository.findByToken.mockReturnValue(undefined);

    // @ts-ignore
    const resource: BaseResource<ExceptionResource> = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.UNAUTHORIZED);
    expect(resource.response.errorName).toBe('InvalidTokenException');
    expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
  });

  test('Should return an InternalServerError resource if route controller was not found', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({ action: ApiAction.LOGIN } as BaseRequest);
    mockRequestBuilder.method.mockReturnValue(HttpMethod.POST);

    // @ts-ignore
    mockGeneralFactory.mountEntrypoints.mockReturnValue({});

    // @ts-ignore
    const resource: BaseResource<ExceptionResource> = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.INTERNAL_SERVER_ERROR);
    expect(resource.response.errorName).toBe('InternalServerErrorException');
    expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
  });

  test('Should return an InternalServerError resource if route controller method was not found', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({ action: ApiAction.LOGIN } as BaseRequest);
    mockRequestBuilder.method.mockReturnValue(HttpMethod.POST);

    // @ts-ignore
    mockGeneralFactory.mountEntrypoints.mockReturnValue({ AuthController: {} });

    // @ts-ignore
    const resource: BaseResource<ExceptionResource> = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.INTERNAL_SERVER_ERROR);
    expect(resource.response.errorName).toBe('InternalServerErrorException');
    expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
  });

  test('Should return method response if route controller method is ok in a no authorized route', () => {
    mockRequestBuilder.buildRequest.mockReturnValue({ action: ApiAction.LOGIN } as BaseRequest);
    mockRequestBuilder.method.mockReturnValue(HttpMethod.POST);

    mockGeneralFactory
      .mountEntrypoints
      // @ts-ignore
      .mockReturnValue({ AuthController: { login: () => new BooleanResource(true) } });

    // @ts-ignore
    const resource: BaseResource<BooleanResource> = requestHandler.processRequest();
    expect(resource.code).toBe(HttpCode.OK);
    expect(resource.response.success).toBeTruthy();
    expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
  });

  test(
    'Should return method response if route controller method is ok in an authorized route, with a super admin',
    () => {
      mockRequestBuilder.buildRequest.mockReturnValue({
        action: ApiAction.USERS_LIST,
        token: user.token,
      } as BaseRequest);
      mockRequestBuilder.method.mockReturnValue(HttpMethod.GET);

      const users: User[] = UserBuilder.buildMany(5);

      const simpleUserResources = users.map(mockUser => new SimpleUserResource(mockUser));
      mockGeneralFactory
        .mountEntrypoints
        .mockReturnValue({
          // @ts-ignore
          UserController: {
            listUsers: () => simpleUserResources,
          },
        });

      mockRoleService.getUserRoles.mockReturnValue(RoleBuilder.buildFromRoleNames([ RoleName.SUPER_ADMIN ]));

      // @ts-ignore
      const resource: BaseResource<NetResource> = requestHandler.processRequest();
      expect(resource.code).toBe(HttpCode.OK);
      expect(resource.response).toStrictEqual(simpleUserResources);
      expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
    },
  );

  test(
    'Should return method response if route controller method is ok in an authorized route, with no roles assigned',
    () => {
      mockRequestBuilder.buildRequest.mockReturnValue({ action: ApiAction.ME, token: user.token } as BaseRequest);
      mockRequestBuilder.method.mockReturnValue(HttpMethod.GET);

      mockGeneralFactory
        .mountEntrypoints
        // @ts-ignore
        .mockReturnValue({ AuthController: { me: () => new UserResource(user) } });

      mockRoleService.getUserRoles.mockReturnValue([]);

      // @ts-ignore
      const resource: BaseResource<UserResource> = requestHandler.processRequest();
      expect(resource.code).toBe(HttpCode.OK);
      expect(resource.response.id).toBe(user.id);
      expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
    },
  );

  test(
    'Should return method response if route controller method is ok in an authorized route, if user has some authorized role',
    () => {
      mockRequestBuilder.buildRequest.mockReturnValue({
        action: ApiAction.USERS_LIST,
        token: user.token,
      } as BaseRequest);
      mockRequestBuilder.method.mockReturnValue(HttpMethod.GET);

      mockGeneralFactory
        .mountEntrypoints
        // @ts-ignore
        .mockReturnValue({ UserController: { listUsers: () => [] } });

      mockRoleService.getUserRoles.mockReturnValue(RoleBuilder.buildFromRoleNames([ RoleName.OTHER_ROLE ]));

      // @ts-ignore
      const resource: BaseResource<ProgramResource[]> = requestHandler.processRequest();
      expect(resource.code).toBe(HttpCode.OK);
      expect(resource.response.length).toBe(0);
      expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
    },
  );

  test(
    'Should return ForbiddenException resource if user does not has any authorized role for the route',
    () => {
      mockRequestBuilder.buildRequest.mockReturnValue({
        action: ApiAction.USERS_LIST,
        token: user.token,
      } as BaseRequest);
      mockRequestBuilder.method.mockReturnValue(HttpMethod.GET);

      mockRoleService.getUserRoles.mockReturnValue(RoleBuilder.buildFromRoleNames([]));

      // @ts-ignore
      const resource: BaseResource<ExceptionResource> = requestHandler.processRequest();
      expect(resource.code).toBe(HttpCode.FORBIDDEN);
      expect(resource.response.errorName).toBe('ForbiddenException');
      expect(mockHttpExecutionsReporter.persistExecution).toHaveBeenCalled();
    },
  );
});
