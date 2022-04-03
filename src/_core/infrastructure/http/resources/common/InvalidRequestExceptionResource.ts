import { ExceptionResource } from './ExceptionResource';

export class InvalidRequestExceptionResource extends ExceptionResource {

  public errors: object;

  constructor(errorMessage: string, errorName: string, stack: string, errors: object) {
    super(errorMessage, errorName, stack);
    this.errors = errors;
  }
}
