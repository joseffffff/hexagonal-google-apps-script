import { BaseRequest } from '../http/requests/BaseRequest';
import { BaseValidator } from './validators/BaseValidator';
import { InternalServerErrorException } from '../../domain/exception/InternalServerErrorException';
import { MinLengthValidator } from './validators/MinLengthValidator';
import { TypeValidator } from './validators/TypeValidator';
import { ValidationRules } from './ValidationRules';
import { MaxLengthValidator } from './validators/MaxLengthValidator';
import { InvalidRequestException } from './InvalidRequestException';
import { MinValidator } from './validators/MinValidator';
import { MaxValidator } from './validators/MaxValidator';
import { ValidationError } from './ValidationError';

interface ValidationResult {
  [x: string]: string[];
}

export class RequestValidator {

  private validators: { [key: string]: BaseValidator<unknown, unknown> } = {
    type: new TypeValidator(),
    minLength: new MinLengthValidator(),
    maxLength: new MaxLengthValidator(),
    min: new MinValidator(),
    max: new MaxValidator(),
  };

  public validateOrFail(request: BaseRequest | object, fieldsRules: ValidationRules): void {
    const errors = this.validate(request, fieldsRules);

    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      throw new InvalidRequestException(errors);
    }
  }

  public validate(request: BaseRequest | object, fieldsRules: ValidationRules): ValidationResult {

    const errors: ValidationResult = {};

    Object.entries(fieldsRules).forEach(([ field, rules ]) => {

      // @ts-ignore
      const fieldValue = request[field];
      if (rules.optional && fieldValue === undefined) {
        return;
      }

      if (!rules.optional && fieldValue === undefined) {
        errors[field] = [ValidationError.OPTIONAL];
        return errors;
      }

      Object.entries(rules)
        .filter(([ validation ])=> validation !== 'optional')
        .forEach(([ validation, validationParam ]) => {

        const validator = this.findValidator(validation);

        let isValid: boolean;

        try {
          isValid = validator.isValid(fieldValue, validationParam);
        } catch (e) {
          isValid = false;
        }

        if (!isValid) {
          if (!Object.keys(errors).includes(field)) {
            errors[field] = [];
          }

          const error = validator.error(validationParam);
          errors[field].push(error);
        }
      });
    });

    return errors;
  }

  private findValidator(validation: string): BaseValidator<unknown, unknown> {

    const validator = this.validators[validation];

    if (!validator) {
      throw new InternalServerErrorException(`No validator found for validation ${validation}`);
    }

    return validator;
  }
}
