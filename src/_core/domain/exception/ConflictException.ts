import { Exception } from './Exception';

export class ConflictException implements Exception {
  public message: string;
  public code: number;
  public name: string;

  public constructor(message: string, code: number = 409, name: string = 'ConflictException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
