import { Exception } from './Exception';

export class InternalServerErrorException implements Exception {
  public message: string;
  public code: number;
  public name: string;

  public constructor(
      message: string = 'Internal server error.',
      code: number = 500,
      name: string = 'InternalServerErrorException') {
    this.message = message;
    this.code = code;
    this.name = name;
  }
}
