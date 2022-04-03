import { HttpClient } from '../../../../src/_core/domain/services/http/HttpClient';
import { mock, MockProxy } from 'jest-mock-extended';
import { GoogleJwtValidator } from '../../../../src/_core/domain/services/GoogleJwtValidator';
import { ValidationException } from '../../../../src/_core/domain/exception/ValidationException';

describe('GoogleJwtValidator test cases', () => {

  let httpClient: MockProxy<HttpClient>;

  beforeEach(() => {
    httpClient = mock<HttpClient>();
  });

  test('validate with empty token', () => {
    const validator = new GoogleJwtValidator(httpClient);

    expect(() => {
      validator.validate('');
    }).toThrow(ValidationException);
  });

  test('validate with invalid token', () => {
    const validator = new GoogleJwtValidator(httpClient);

    expect(() => {
      validator.validate('thisisaninvalidtoken');
    }).toThrow(ValidationException);
  });

  test('validate token bad response code on http request', () => {
    httpClient.get.mockReturnValue({
      code: 500,
      headers: {},
      content: '',
      jsonContent: {},
    });

    const validator = new GoogleJwtValidator(httpClient);

    expect(() => {
      validator.validate('this.is.a.invalidtoken');
    }).toThrowError(ValidationException);
  });

  test('validate token good response code on http request but wrong expiration time', () => {
    httpClient.get.mockReturnValue({
      code: 200,
      headers: {},
      content: '',
      jsonContent: {
        exp: 1433981953, // expired time
      },
    });

    const validator = new GoogleJwtValidator(httpClient);

    expect(() => {
      validator.validate('this.is.a.valid.token');
    }).toThrowError(ValidationException);
  });

  test('validate token good response code on http request, good expiration time and bad aud', () => {
    httpClient.get.mockReturnValue({
      code: 200,
      headers: {},
      content: '',
      jsonContent: {
        exp: 2933981953, // expired time 2062
        aud: 'different aud',
      },
    });

    const aud = 'thisistheaudofgooglejwtvalidator';

    const validator = new GoogleJwtValidator(httpClient, aud);

    expect(() => {
      validator.validate('this.is.a.valid.token');
    }).toThrowError(ValidationException);
  });

  test('validate token good response code on http request, good expiration time, good aud and bad iss', () => {

    const aud = 'thisistheaudofgooglejwtvalidator';

    httpClient.get.mockReturnValue({
      code: 200,
      headers: {},
      content: '',
      jsonContent: {
        exp: 2933981953, // expired time 2062
        aud,
        iss: 'wrong.domain.com',
      },
    });

    const validator = new GoogleJwtValidator(httpClient, aud);

    expect(() => {
      validator.validate('this.is.a.valid.token');
    }).toThrowError(ValidationException);
  });

  test(
    'validate token good response code on http request, good expiration time, good aud, good iss, no email verified',
    () => {

      const aud = 'thisistheaudofgooglejwtvalidator';

      httpClient.get.mockReturnValue({
        code: 200,
        headers: {},
        content: '',
        jsonContent: {
          exp: 2933981953, // expired time 2062
          aud,
          iss: 'accounts.google.com', // good domain
          email_verified: false,
        },
      });

      const validator = new GoogleJwtValidator(httpClient, aud);

      expect(() => {
        validator.validate('this.is.a.valid.token');
      }).toThrowError(ValidationException);
    },
  );

  test('validate token with everything ok', () => {

    const aud = 'thisistheaudofgooglejwtvalidator';

    const tokenContent = {
      exp: 2933981953, // expired time 2062
      aud,
      iss: 'accounts.google.com', // good domain
      email_verified: true,
    };

    httpClient.get.mockReturnValue({
      code: 200,
      headers: {},
      content: '',
      jsonContent: tokenContent,
    });

    const validator = new GoogleJwtValidator(httpClient, aud);

    expect(validator.validate('this.is.a.valid.token')).toBe(tokenContent);
  });
});
