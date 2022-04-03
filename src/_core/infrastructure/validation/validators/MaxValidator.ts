import { BaseValidator } from './BaseValidator';
import { ValidationError } from '../ValidationError';

export class MaxValidator implements BaseValidator<number, number> {
  public error(validationParam: number): ValidationError {
    return ValidationError.MAX;
  }

  public isValid(value: number, validationParam: number): boolean {
    return typeof value === 'number' && value < validationParam;
  }
}
