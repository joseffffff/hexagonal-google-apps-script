import { EntityBase } from '../../../domain/entities/EntityBase';
import { HttpMethod } from '../HttpMethod';

export class HttpExecution extends EntityBase {
  public userId: string;
  public action: string;
  public startDate: Date;
  public endDate: Date;
  public responseCode: number;
  public method: HttpMethod;
  public exception?: string;

  constructor(entity: HttpExecution) {
    super(entity);
    this.userId = entity.userId;
    this.action = entity.action;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.responseCode = entity.responseCode;
    this.exception = entity.exception;
    this.method = entity.method;
  }
}
