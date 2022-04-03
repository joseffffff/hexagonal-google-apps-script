import { Exception } from '../../domain/exception/Exception';
import { HttpCode } from '../http/HttpCode';

export class WrongMethodException implements Exception {
  public readonly message: string;
  public readonly code: number;
  public readonly name: string;

  public constructor(
    message: string = 'Wrong method used for this action.',
    code: number = HttpCode.METHOD_NOT_ALLOWED,
    name: string = 'WrongMethodException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
