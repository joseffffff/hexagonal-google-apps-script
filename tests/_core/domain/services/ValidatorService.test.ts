import { ValidatorService } from '../../../../src/_core/domain/services/validations/ValidatorService';
import { Type } from '../../../../src/_core/domain/services/validations/Type';

describe('ValidatorService test cases', () => {

  let validatorService: ValidatorService;

  beforeEach(() => {
    validatorService = new ValidatorService();
  });

  test('validateEmail', () => {
    expect(validatorService.validateEmail('notValidEmail')).toBe(false);
    expect(validatorService.validateEmail('notValidEmail.com')).toBe(false);
    expect(validatorService.validateEmail('prettyandsimple@example.com')).toBe(true);
    expect(validatorService.validateEmail('very.common@example.com')).toBe(true);
    expect(validatorService.validateEmail('disposable.style.email.with+symbol@example.com')).toBe(true);
    expect(validatorService.validateEmail('other.email-with-dash@example.com@example.com')).toBe(false);
    expect(validatorService.validateEmail('other.email-with-dash@example.com')).toBe(true);
  });

  test('validateDate', () => {
    expect(validatorService.validateDate('2020-05-05')).toBe(true);
    expect(validatorService.validateDate('2020-31-05')).toBe(false);
    expect(validatorService.validateDate('20-12-2020')).toBe(false);
    expect(validatorService.validateDate('2020-12-31')).toBe(true);
    expect(validatorService.validateDate('2020-02-30')).toBe(true); // converts to 02/03
    expect(validatorService.validateDate('2020-02-32')).toBe(false);
    expect(validatorService.validateDate('01/01/2001')).toBe(true);
    expect(validatorService.validateDate('01/01/2001 12:31')).toBe(true);
    expect(validatorService.validateDate('01/01/2001 12:31:01')).toBe(true);
    expect(validatorService.validateDate('01/01/2001 26:31:01')).toBe(false);
    expect(validatorService.validateDate(1234 as unknown as string)).toBe(false);
    expect(validatorService.validateDate([1, 2, 3, 4] as unknown as string)).toBe(false);
    expect(validatorService.validateDate({a: 1} as unknown as string)).toBe(false);
  });

  test('validateArray', () => {
    expect(validatorService.validateArray([ 'value' ])).toBe(true);
    expect(validatorService.validateArray([])).toBe(true);
    // @ts-ignore
    expect(validatorService.validateArray({})).toBe(false);
    // @ts-ignore
    expect(validatorService.validateArray(undefined)).toBe(false);
    // @ts-ignore
    expect(validatorService.validateArray('an string')).toBe(false);
  });

  test('validateObject', () => {
    expect(validatorService.validateObject({
      description: 'hi',
      value: 5,
    }, {
      description: Type.STRING,
      value: Type.NUMBER,
    })).toBe(true);
    expect(validatorService.validateObject({
      description: 'hi',
      value: 'this should be a number',
    }, {
      description: Type.STRING,
      value: Type.NUMBER,
    })).toBe(false);
  });

  test('validateValueType', () => {
    expect(validatorService.validateValueType('this is an string', Type.STRING)).toBe(true);
    expect(validatorService.validateValueType('this is an string', Type.NUMBER)).toBe(false);
    expect(validatorService.validateValueType(56, Type.NUMBER)).toBe(true);
    expect(validatorService.validateValueType('an string', Type.NUMBER)).toBe(false);
    expect(validatorService.validateValueType({ a: 'b' }, Type.OBJECT)).toBe(true);
    expect(validatorService.validateValueType({ a: 'b' }, Type.NUMBER)).toBe(false);
    expect(validatorService.validateValueType({ a: 'b' }, Type.STRING)).toBe(false);
  });
});
