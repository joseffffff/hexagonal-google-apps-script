import { BaseValidator } from './BaseValidator';
import { RequestFieldType } from '../RequestFieldType';
import { ValidationError } from '../ValidationError';
import { InternalServerErrorException } from '../../../domain/exception/InternalServerErrorException';
import { BaseTypeValidator } from './type/BaseTypeValidator';
import { EmailValidator } from './type/EmailValidator';
import { StringValidator } from './type/StringValidator';
import { IntegerValidator } from './type/IntegerValidator';
import { TypedArrayValidator } from './type/TypedArrayValidator';
import { BooleanValidator } from './type/BooleanValidator';
import { PictureValidator } from './type/PictureValidator';

export class TypeValidator implements BaseValidator<string, RequestFieldType> {

  private typeValidators: { [type: string]: BaseTypeValidator<unknown> } = {
    [RequestFieldType.EMAIL]: new EmailValidator(),
    [RequestFieldType.STRING]: new StringValidator(),
    [RequestFieldType.INTEGER]: new IntegerValidator(),
    [RequestFieldType.OBJECT_ARRAY]: new TypedArrayValidator('object'),
    [RequestFieldType.BOOLEAN]: new BooleanValidator(),
    [RequestFieldType.PICTURE]: new PictureValidator(),
  };

  public isValid(value: string, validationParam: RequestFieldType): boolean {
    const validator: BaseTypeValidator<unknown> = this.findTypeValidator(validationParam);
    return validator.isValid(value);
  }

  public error(validationParam: RequestFieldType): ValidationError {
    const validator = this.findTypeValidator(validationParam);
    return validator.error(validationParam);
  }

  private findTypeValidator(validationParam: RequestFieldType): BaseTypeValidator<unknown> {

    const validator = this.typeValidators[validationParam];

    if (!validator) {
      throw new InternalServerErrorException(`No type validator found for ${validationParam}`);
    }

    return validator;
  }
}
