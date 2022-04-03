import { Exception } from '../../domain/exception/Exception';
import { HttpCode } from '../http/HttpCode';

export class GoneException implements Exception {
  public message: string;
  public code: number;
  public name: string;

  public constructor(
    message: string = 'This resource is not available anymore.',
    code: number = HttpCode.GONE,
    name: string = 'GoneException',
  ) {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
