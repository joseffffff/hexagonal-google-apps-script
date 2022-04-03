import { Exception } from './Exception';

export class ValidationException implements Exception {
  public message: string;
  public name: string;
  public code: number;

  public constructor(message: string, name: string = 'ValidationException', code: number = 400) {
    this.message = message;
    this.name = name;
    this.code = code;
  }

}
