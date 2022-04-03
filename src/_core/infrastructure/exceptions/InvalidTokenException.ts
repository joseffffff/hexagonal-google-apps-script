import { Exception } from '../../domain/exception/Exception';
import { HttpCode } from '../http/HttpCode';

export class InvalidTokenException implements Exception {
  public message: string;
  public code: number;
  public name: string;

  public constructor(
      message: string = 'Invalid Token provided',
      code: number = HttpCode.UNAUTHORIZED,
      name: string = 'InvalidTokenException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
