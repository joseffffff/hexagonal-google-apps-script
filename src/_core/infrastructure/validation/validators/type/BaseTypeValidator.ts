import { ValidationError } from '../../ValidationError';
import { RequestFieldType } from '../../RequestFieldType';

export interface BaseTypeValidator<T> {
  isValid(value: T): boolean;
  error(type: RequestFieldType): ValidationError;
}
