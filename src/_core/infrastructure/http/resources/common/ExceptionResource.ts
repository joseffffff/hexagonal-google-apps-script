export class ExceptionResource {

  public readonly errorMessage: string;
  public readonly errorName: string;
  public readonly stack: string;

  public constructor(errorMessage: string, errorName: string, stack: string = '') {
    this.errorMessage = errorMessage;
    this.errorName = errorName;
    this.stack = stack;
  }
}
