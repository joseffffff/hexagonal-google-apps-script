import { RequestValidator } from '../../../../src/_core/infrastructure/validation/RequestValidator';
import { RequestFieldType } from '../../../../src/_core/infrastructure/validation/RequestFieldType';
import { ValidationError } from '../../../../src/_core/infrastructure/validation/ValidationError';
import { ValidationRules } from '../../../../src/_core/infrastructure/validation/ValidationRules';
import { Base64FileRequest } from '../../../../src/_core/infrastructure/http/requests/common/Base64FileRequest';

describe('RequestValidator tests', () => {

  let requestValidator: RequestValidator;

  beforeEach(() => {
    requestValidator = new RequestValidator();
  });

  test('validate email', () => {
    const request = { email: 'invalidEmail' };

    const result = requestValidator.validate(request, {
      email: {
        type: RequestFieldType.EMAIL,
      },
    });

    expect(result).toStrictEqual({
      email: [
        ValidationError.EMAIL,
      ],
    });
  });

  test('validate email and minLength', () => {
    const request = { email: 'a@a.com' };

    const result = requestValidator.validate(request, {
      email: {
        type: RequestFieldType.EMAIL,
        minLength: 8,
      },
    });

    expect(result).toStrictEqual({
      email: [
        ValidationError.MIN_LENGTH,
      ],
    });
  });

  test('validate string type', () => {
    const fieldRules = {
      name: {
        type: RequestFieldType.STRING,
      },
    };

    const validRequest = { name: 'John' };
    expect(requestValidator.validate(validRequest, fieldRules)).toStrictEqual({});

    const invalidRequest = { name: 1234 };
    expect(requestValidator.validate(invalidRequest, fieldRules)).toStrictEqual({
      name: [
        ValidationError.STRING,
      ],
    });
  });

  test('validate string with min and max length', () => {
    const fieldRules: ValidationRules = {
      name: {
        type: RequestFieldType.STRING,
        minLength: 2,
        maxLength: 6,
      },
    };

    const invalidRequest = { name: 'John Doe' };
    expect(requestValidator.validate(invalidRequest, fieldRules)).toStrictEqual({
      name: [
        ValidationError.MAX_LENGTH,
      ],
    });
    const anotherInvalidRequest = { name: 1 };
    expect(requestValidator.validate(anotherInvalidRequest, fieldRules)).toStrictEqual({
      name: [
        ValidationError.STRING,
        ValidationError.MIN_LENGTH,
        ValidationError.MAX_LENGTH,
      ],
    });
  });

  test('validate number', () => {

    const fieldRules: ValidationRules = {
      age: {
        type: RequestFieldType.INTEGER,
      },
    };

    const request = { age: 5 };
    expect(requestValidator.validate(request, fieldRules)).toStrictEqual({});
    const invalidRequest = { age: 'test' };
    expect(requestValidator.validate(invalidRequest, fieldRules)).toStrictEqual({
      age: [
        ValidationError.INTEGER,
      ],
    });
    const anotherInvalidRequest = { age: 3.53 };
    expect(requestValidator.validate(anotherInvalidRequest, fieldRules)).toStrictEqual({
      age: [
        ValidationError.INTEGER,
      ],
    });
  });

  test('validate boolean', () => {
    const fieldRules: ValidationRules = {
      isPublic: {
        type: RequestFieldType.BOOLEAN,
      },
    };

    const validRequest = { isPublic: true };
    expect(requestValidator.validate(validRequest, fieldRules)).toStrictEqual({});
    const anotherValidRequest = { isPublic: false };
    expect(requestValidator.validate(anotherValidRequest, fieldRules)).toStrictEqual({});

    const invalidRequest = { isPublic: 'yeah' };
    expect(requestValidator.validate(invalidRequest, fieldRules)).toStrictEqual({
      isPublic: [
        ValidationError.BOOLEAN,
      ],
    });
    const anotherInvalidRequest = { isPublic: 1234 };
    expect(requestValidator.validate(anotherInvalidRequest, fieldRules)).toStrictEqual({
      isPublic: [
        ValidationError.BOOLEAN,
      ],
    });
  });

  test('validate min property', () => {
    const fieldRules: ValidationRules = {
      age: {
        type: RequestFieldType.INTEGER,
        min: 5,
      },
    };

    const validRequest = { age: 6 };
    expect(requestValidator.validate(validRequest, fieldRules)).toStrictEqual({});
    const anotherValidRequest = { age: 15_000_000 };
    expect(requestValidator.validate(anotherValidRequest, fieldRules)).toStrictEqual({});

    const invalidRequest = { age: -10 };
    expect(requestValidator.validate(invalidRequest, fieldRules)).toStrictEqual({
      age: [
        ValidationError.MIN,
      ],
    });
    const anotherInvalidRequest = { age: 'this is not an integer' };
    expect(requestValidator.validate(anotherInvalidRequest, fieldRules)).toStrictEqual({
      age: [
        ValidationError.INTEGER,
        ValidationError.MIN,
      ],
    });
  });

  test('validate max property', () => {
    const fieldRules: ValidationRules = {
      age: {
        type: RequestFieldType.INTEGER,
        max: 5,
      },
    };

    const validRequest = { age: 4 };
    expect(requestValidator.validate(validRequest, fieldRules)).toStrictEqual({});
    const anotherValidRequest = { age: -3 };
    expect(requestValidator.validate(anotherValidRequest, fieldRules)).toStrictEqual({});

    const invalidRequest = { age: 50 };
    expect(requestValidator.validate(invalidRequest, fieldRules)).toStrictEqual({
      age: [
        ValidationError.MAX,
      ],
    });
    const anotherInvalidRequest = { age: 'this is not an integer' };
    expect(requestValidator.validate(anotherInvalidRequest, fieldRules)).toStrictEqual({
      age: [
        ValidationError.INTEGER,
        ValidationError.MAX,
      ],
    });
  });

  test('validate image type', () => {
    const fieldRules: ValidationRules = {
      picture: {
        type: RequestFieldType.PICTURE,
      },
    };

    const exampleImageContent =
      'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAA'
      + 'Bl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFS'
      + 'qiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffe'
      + 'kFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5I'
      + 'WryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC'
      + '/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n'
      + '0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4td'
      + 'Ql5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979'
      + 'jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P'
      + '+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8'
      + 'ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/'
      + 'dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5A'
      + 'zFfo379UAAAAASUVORK5CYII=';

    const validRequest: { picture: Base64FileRequest } = {
      picture: {
        fileContent: exampleImageContent,
        filename: 'emoji.png',
        mimeType: 'image/png',
      },
    };
    expect(requestValidator.validate(validRequest, fieldRules)).toStrictEqual({});

    const invalidRequest: { picture: Base64FileRequest } = {
      picture: {
        fileContent: 'this is a not valid image',
        filename: 'emoji.invalidextension',
        mimeType: 'wrong mime type',
      },
    };
    expect(requestValidator.validate(invalidRequest, fieldRules))
      .toStrictEqual({ picture: [ ValidationError.PICTURE ] });

    const undefinedFieldsRequest: { picture: Base64FileRequest } = {
      picture: {
        fileContent: undefined,
        filename: 'emoji.png',
        mimeType: 'image/png',
      },
    };
    expect(requestValidator.validate(undefinedFieldsRequest, fieldRules))
      .toStrictEqual({ picture: [ ValidationError.PICTURE ] });

    const badContentRequest: { picture: Base64FileRequest } = {
      picture: {
        fileContent: 'this is not a valid content',
        filename: 'emoji.png',
        mimeType: 'image/png',
      },
    };
    expect(requestValidator.validate(badContentRequest, fieldRules))
      .toStrictEqual({ picture: [ ValidationError.PICTURE ] });
  });

  test('validate optional field', () => {
    const fieldRules: ValidationRules = {
      name: {
        type: RequestFieldType.STRING,
        optional: true,
      },
      description: {
        type: RequestFieldType.STRING,
        optional: false,
      },
    };

    const validRequest = {
      name: 'Name',
    };
    expect(requestValidator.validate(validRequest, fieldRules)).toStrictEqual({description: [ValidationError.OPTIONAL]});
  });
});
