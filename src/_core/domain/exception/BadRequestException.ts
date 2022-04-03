import { Exception } from './Exception';

export class BadRequestException implements Exception {
  public message: string;
  public code: number;
  public name: string;

  constructor(message: string = 'Bad Request', code: number = 400, name: string = 'BadRequestException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
