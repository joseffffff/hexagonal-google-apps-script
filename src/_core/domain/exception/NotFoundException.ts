import { Exception } from './Exception';

export class NotFoundException implements Exception {
  public message: string;
  public code: number;
  public name: string;

  public constructor(message: string = 'Resource not found', code: number = 404, name: string = 'NotFoundException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
