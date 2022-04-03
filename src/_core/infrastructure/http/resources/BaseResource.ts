import { ExceptionResource } from './common/ExceptionResource';

export class BaseResource<T> {
  code: number;
  response: T;
  logs: string[] | undefined;
  action: string;

  constructor(code: number, response: T, logs?: string[] | undefined, action?: string) {
    this.code = code;
    this.response = response;

    if (!!logs) {
      this.logs = logs;
    }

    this.action = action;
  }

  public hasExceptionResource(): boolean {
    return this.response instanceof ExceptionResource;
  }
}
