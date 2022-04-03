import { ValidationException } from '../../domain/exception/ValidationException';

export class InvalidRequestException extends ValidationException {

  public errors: { [x: string]: string[] };

  constructor(errors: { [x: string]: string[] }) {
    super('There are some errors on the request');
    this.errors = errors;
  }
}
