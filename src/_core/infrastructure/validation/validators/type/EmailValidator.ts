import { ValidationError } from '../../ValidationError';
import { BaseTypeValidator } from './BaseTypeValidator';

export class EmailValidator implements BaseTypeValidator<string> {
  public error(): ValidationError {
    return ValidationError.EMAIL;
  }

  public isValid(value: string): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return typeof value === 'string' && regex.test(value);
  }
}
