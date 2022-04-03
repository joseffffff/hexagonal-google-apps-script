import { BaseValidator } from './BaseValidator';
import { ValidationError } from '../ValidationError';

export class MinLengthValidator implements BaseValidator<string, number> {

  public error(): ValidationError {
    return ValidationError.MIN_LENGTH;
  }

  public isValid(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }
}
