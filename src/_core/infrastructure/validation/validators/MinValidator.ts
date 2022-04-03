import { BaseValidator } from './BaseValidator';
import { ValidationError } from '../ValidationError';

export class MinValidator implements BaseValidator<number, number> {
  public error(validationParam: number): ValidationError {
    return ValidationError.MIN;
  }

  public isValid(value: number, validationParam: number): boolean {
    return typeof value === 'number' && value > validationParam;
  }
}
