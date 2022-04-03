import { BaseTypeValidator } from './BaseTypeValidator';
import { RequestFieldType } from '../../RequestFieldType';
import { ValidationError } from '../../ValidationError';

export class BooleanValidator implements BaseTypeValidator<boolean> {
  public error(type: RequestFieldType): ValidationError {
    return ValidationError.BOOLEAN;
  }

  public isValid(value: boolean): boolean {
    return typeof value === 'boolean';
  }
}
