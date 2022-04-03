import { Exception } from '../../domain/exception/Exception';
import { HttpCode } from '../http/HttpCode';

export class InvalidActionException implements Exception {
  public readonly message: string;
  public readonly code: number;
  public readonly name: string;

  public constructor(
      message: string = 'Invalid action provided',
      code: number = HttpCode.BAD_REQUEST,
      name: string = 'InvalidActionException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
