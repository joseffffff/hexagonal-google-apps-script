import { BaseValidator } from './BaseValidator';
import { ValidationError } from '../ValidationError';

export class MaxLengthValidator implements BaseValidator<string, number> {
  public error(validationParam: number): ValidationError {
    return ValidationError.MAX_LENGTH;
  }

  public isValid(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }
}
