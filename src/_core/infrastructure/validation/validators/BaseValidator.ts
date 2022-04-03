import { ValidationError } from '../ValidationError';

export interface BaseValidator<T, V> {
  isValid(value: T, validationParam: V): boolean;
  error(validationParam: V): ValidationError;
}
