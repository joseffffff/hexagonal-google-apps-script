import { HttpExecutionsReporter, HttpMethod } from '../../../../../src/_core/infrastructure/http';
import { HttpExecutionRepository } from '../../../../../src/_core/infrastructure/http/reporting/HttpExecutionRepository';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpCode } from '../../../../../src/_core/infrastructure/http/HttpCode';
import { User } from '../../../../../src/_core/domain/entities/User';
import { UserBuilder } from '../../../builders/UserBuilder';
import { BaseResource } from '../../../../../src/_core/infrastructure/http/resources/BaseResource';
import { BooleanResource } from '../../../../../src/_core/infrastructure/http/resources/common/BooleanResource';
import { ExceptionResource } from '../../../../../src/_core/infrastructure/http/resources/common/ExceptionResource';

describe('HttpExecutionsReporter test cases', () => {

  let mockHttpExecutionRepository: MockProxy<HttpExecutionRepository>;

  let httpExecutionsReporter: HttpExecutionsReporter;

  beforeEach(() => {
    mockHttpExecutionRepository = mock<HttpExecutionRepository>();

    httpExecutionsReporter = new HttpExecutionsReporter(mockHttpExecutionRepository);
  });

  test('Should persist info about http execution', () => {
    const action = 'action';
    const user: User = UserBuilder.buildOne();
    const startDate = new Date();
    const endDate = new Date();
    const method = HttpMethod.GET;

    const request = { action };
    const resource = new BaseResource<BooleanResource>(HttpCode.OK, new BooleanResource(true), [], action);

    httpExecutionsReporter.persistExecution(request, resource, user, startDate, endDate, method);

    const createdHttpExecution = mockHttpExecutionRepository.save.mock.calls[0][0];
    expect(createdHttpExecution.action).toBe(action);
    expect(createdHttpExecution.userId).toStrictEqual(user.id);
    expect(createdHttpExecution.startDate).toStrictEqual(startDate);
    expect(createdHttpExecution.endDate).toStrictEqual(endDate);
    expect(createdHttpExecution.responseCode).toStrictEqual(resource.code);
    expect(createdHttpExecution.method).toStrictEqual(method);
    expect(createdHttpExecution.exception).toBeUndefined();
  });

  test('Should persist info about http execution with exception when has an exception resource', () => {
    const action = 'action';
    const user: User = UserBuilder.buildOne();
    const startDate = new Date();
    const endDate = new Date();
    const method = HttpMethod.POST;

    const request = { action };
    const resource = new BaseResource<ExceptionResource>(
      HttpCode.BAD_REQUEST,
      new ExceptionResource('error message', 'ValidationException'),
      [],
      action,
    );

    httpExecutionsReporter.persistExecution(request, resource, user, startDate, endDate, method);

    const createdHttpExecution = mockHttpExecutionRepository.save.mock.calls[0][0];
    expect(createdHttpExecution.action).toBe(action);
    expect(createdHttpExecution.userId).toStrictEqual(user.id);
    expect(createdHttpExecution.startDate).toStrictEqual(startDate);
    expect(createdHttpExecution.endDate).toStrictEqual(endDate);
    expect(createdHttpExecution.responseCode).toStrictEqual(resource.code);
    expect(createdHttpExecution.method).toStrictEqual(method);
    expect(createdHttpExecution.exception).toBe('ValidationException');
  });
});
