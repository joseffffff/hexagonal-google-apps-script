import { BaseResource } from '../resources/BaseResource';
import { BaseRequest } from '../requests/BaseRequest';
import { NoActionResource } from '../resources/common/NoActionResource';
import { Route } from '../Route';
import { RequestBuilder } from './RequestBuilder';
import { RoutesProvider } from '../../../../RoutesProvider';
import { GeneralFactory } from '../../factories/GeneralFactory';
import { UserRepository } from '../../../domain/services/repositories/UserRepository';
import { Exception } from '../../../domain/exception/Exception';
import { ExceptionResource } from '../resources/common/ExceptionResource';
import { InternalServerErrorException } from '../../../domain/exception/InternalServerErrorException';
import { InvalidActionException } from '../../exceptions/InvalidActionException';
import { InvalidTokenException } from '../../exceptions/InvalidTokenException';
import { User } from '../../../domain/entities/User';
import { Env } from '../../../../env';
import { LoggingService } from '../../../domain/services/LoggingService';
import { WrongMethodException } from '../../exceptions/WrongMethodException';
import { RoleName } from '../../../domain/valueobjects/RoleName';
import { ForbiddenException } from '../../exceptions/ForbiddenException';
import { RoleService } from '../../../domain/services/entityservices/RoleService';
import { HttpExecutionsReporter } from '../reporting/HttpExecutionsReporter';
import { InvalidRequestException } from '../../validation/InvalidRequestException';
import { InvalidRequestExceptionResource } from '../resources/common/InvalidRequestExceptionResource';

export class RequestHandler {
  public constructor(
    private requestBuilder: RequestBuilder,
    private routesProvider: RoutesProvider,
    private generalFactory: GeneralFactory,
    private userRepository: UserRepository,
    private loggingService: LoggingService,
    private roleService: RoleService,
    private httpExecutionsReporter: HttpExecutionsReporter,
  ) {
  }

  public processRequest(): BaseResource<object | string | ExceptionResource> {

    const request: BaseRequest = this.requestBuilder.buildRequest();

    if (!request.action) {
      return new NoActionResource('No Action provided in the request.');
    }

    return this.sendRequestToController(request);
  }

  private findRouteByAction(action: string): Route | undefined {
    return this.routesProvider.routes().find(route => route.action === action);
  }

  private findRouteByActionOrFail(action: string): Route {
    const route = this.findRouteByAction(action);

    if (!route) {
      throw new InvalidActionException('Invalid action ' + action);
    }

    return route;
  }

  private sendRequestToController(request: BaseRequest): BaseResource<object | string | ExceptionResource> {
    let resource: BaseResource<object | string | ExceptionResource>;
    let user: User | undefined;
    const startDate = new Date();

    try {
      const route = this.findRouteByActionOrFail(request.action);

      this.validateHttpMethodOrFail(route);

      if (route.requireAuth) {
        user = this.findUserAndValidatePermissions(request, route);
      }

      const controller = this.findControllerAndValidateMethod(route);
      // @ts-ignore
      const response = controller[route.controllerMethod](request, user);

      resource = new BaseResource<typeof response>(
        200,
        response,
        Env.SHOW_LOGS ? this.loggingService.logs() : undefined,
        request.action,
      );
    } catch (e) {
      this.loggingService.log('Throwing exception.');
      const exception: Exception = e as Exception;
      resource = new BaseResource<ExceptionResource>(
        exception.code,
        this.buildExceptionResource(exception),
        Env.SHOW_LOGS ? this.loggingService.logs() : undefined,
        request.action,
      );
    }

    const endDate = new Date();
    this.httpExecutionsReporter.persistExecution(
      request,
      resource,
      user,
      startDate,
      endDate,
      this.requestBuilder.method(),
    );

    return resource;
  }

  private buildExceptionResource(exception: Exception): ExceptionResource {

    if (exception instanceof InvalidRequestException) {
      return new InvalidRequestExceptionResource(
        exception.message,
        exception.name,
        '',
        exception.errors,
      )
    }

    return new ExceptionResource(exception.message, exception.name, Env.SHOW_LOGS ? exception.stack : undefined);
  }

  private findUserByTokenOrFail(token: string | undefined): User {
    if (!token) {
      throw new InvalidTokenException();
    }

    const user = this.userRepository.findByToken(token);

    if (!user) {
      throw new InvalidTokenException();
    }

    return user;
  }

  private findControllerAndValidateMethod(route: Route): object {
    const controllers = this.generalFactory.mountEntrypoints();

    // @ts-ignore
    const controller = controllers[route.controller];

    if (!controller) {
      throw new InternalServerErrorException('Controller not found.');
    }

    const controllerMethod = controller[route.controllerMethod];

    if (!controllerMethod) {
      throw new InternalServerErrorException('Controller method not found.');
    }

    return controller;
  }

  private validateHttpMethodOrFail(route: Route): void {
    const userMethod = this.requestBuilder.method();

    if (userMethod !== route.method) {
      throw new WrongMethodException();
    }
  }

  private findUserAndValidatePermissions(request: BaseRequest, route: Route): User {
    this.loggingService.log('Pre user query.');

    const user = this.findUserByTokenOrFail(request.token);
    user.setRoles(this.roleService.getUserRoles(user));

    this.loggingService.log('After user query');

    this.validatePermissionsOrFail(user, route.roles);

    this.loggingService.log('After validating permissions.');

    return user;
  }

  private validatePermissionsOrFail(user: User, roles: RoleName[]): void {
    const result: boolean = this.isUserAuthorized(user, roles);

    if (!result) {
      throw new ForbiddenException();
    }
  }

  private isUserAuthorized(user: User, roles: RoleName[]): boolean {
    if (user.hasSuperAdminRole()) {
      return true;
    }

    if (roles.length === 0) {
      return true;
    }

    return user.hasOneOfThisRoles(roles);
  }
}
