import { BaseTypeValidator } from './BaseTypeValidator';
import { RequestFieldType } from '../../RequestFieldType';
import { ValidationError } from '../../ValidationError';

export class IntegerValidator implements BaseTypeValidator<number> {
  public error(type: RequestFieldType): ValidationError {
    return ValidationError.INTEGER;
  }

  public isValid(value: number): boolean {
    return Number.isInteger(value);
  }
}
