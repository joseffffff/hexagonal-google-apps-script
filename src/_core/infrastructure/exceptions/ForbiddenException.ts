import { Exception } from '../../domain/exception/Exception';
import { HttpCode } from '../http/HttpCode';

export class ForbiddenException implements Exception {
  public code: number;
  public message: string;
  public name: string;

  public constructor(
    code: number = HttpCode.FORBIDDEN,
    message: string = 'This user is not allowed to perform this action.',
    name: string = 'ForbiddenException',
  ) {
    this.code = code;
    this.message = message;
    this.name = name;
  }
}
