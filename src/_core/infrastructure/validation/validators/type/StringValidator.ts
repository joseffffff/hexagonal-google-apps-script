import { BaseTypeValidator } from './BaseTypeValidator';
import { RequestFieldType } from '../../RequestFieldType';
import { ValidationError } from '../../ValidationError';

export class StringValidator implements BaseTypeValidator<string> {
  public error(type: RequestFieldType): ValidationError {
    return ValidationError.STRING;
  }

  public isValid(type: string): boolean {
    return typeof type === 'string';
  }
}
