import { Exception } from './Exception';

export class AuthenticationException implements Exception {
  public message: string;
  public code: number;
  public name: string;

  public constructor(message: string, code: number = 401, name: string = 'AuthenticationException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
