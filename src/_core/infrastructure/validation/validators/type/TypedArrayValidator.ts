import { BaseTypeValidator } from './BaseTypeValidator';
import { RequestFieldType } from '../../RequestFieldType';
import { ValidationError } from '../../ValidationError';

export class TypedArrayValidator<T> implements BaseTypeValidator<T[]> {
  constructor(
    private type: string,
  ) {
  }

  public error(type: RequestFieldType): ValidationError {
    return ValidationError.TYPED_ARRAY;
  }

  public isValid(itemList: T[]): boolean {
    return Array.isArray(itemList) && itemList.every(item => typeof item === this.type);
  }
}
