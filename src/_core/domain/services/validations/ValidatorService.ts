import { Type } from './Type';

export class ValidatorService {

  public validateEmail(email: string): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  public validatePassword(password: string): boolean {
    return true;
  }

  public validateDate(date: string): boolean {
    try {
      if (!date || !this.validateValueType(date, Type.STRING)) {
        return false;
      }

      new Date(date).toISOString();
      return true;
    } catch (e) {
      return false;
    }
  }

  public validateDateEqualOrGreaterThanToday(date: string): boolean {
    return new Date(date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0);
  }

  public validateArray(value: unknown[]): boolean {
    return !!value && Array.isArray(value);
  }

  public validateObject(objectToEvaluate: object, structure: { [x: string]: Type }): boolean {
    return Object.keys(structure).every(structureKey => {
      const type: Type = structure[structureKey];

      // @ts-ignore
      const objectValue = objectToEvaluate[structureKey];

      return this.validateValueType(objectValue, type);
    });
  }

  public validateValueType(value: unknown, type: Type): boolean {
    return typeof value === type;
  }

  public validateTypedArray(array: unknown[], type: Type): boolean {
    if (!this.validateArray(array)) {
      return false;
    }

    return array.every(arrayItem => this.validateValueType(arrayItem, type));
  }

  public validateObjectArray(array: object[], structure: { [x: string]: Type }): boolean {
    if (!this.validateArray(array)) {
      return false;
    }

    return array.every(arrayItem => this.validateObject(arrayItem, structure));
  }
}
