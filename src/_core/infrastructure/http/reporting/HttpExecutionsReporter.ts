import { BaseRequest } from '../requests/BaseRequest';
import { BaseResource } from '../resources/BaseResource';
import { User } from '../../../domain/entities/User';
import { HttpExecutionRepository } from './HttpExecutionRepository';
import { HttpExecution } from './HttpExecution';
import { HttpMethod } from '../HttpMethod';

export class HttpExecutionsReporter {

  constructor(
    private httpExecutionRepository: HttpExecutionRepository,
  ) {
  }

  public persistExecution(
    request: BaseRequest,
    resource: BaseResource<unknown>,
    user: User | undefined,
    startDate: Date,
    endDate: Date,
    method: HttpMethod,
  ): void {
    const httpExecution = new HttpExecution({
      action: request.action,
      userId: user?.id,
      responseCode: resource.code,
      startDate,
      endDate,
      method,
      // @ts-ignore
      exception: resource.hasExceptionResource() ? resource.response.errorName : undefined,
    });

    this.httpExecutionRepository.save(httpExecution);
  }
}
