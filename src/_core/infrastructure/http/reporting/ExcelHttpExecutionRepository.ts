import { HttpExecution } from './HttpExecution';
import { HttpExecutionRepository } from './HttpExecutionRepository';
import { Env } from '../../../../env';
import { Orm } from '../../persistence/spreadsheet/orm/Orm';

export class ExcelHttpExecutionRepository implements HttpExecutionRepository {

  private orm: Orm<HttpExecution>;

  constructor() {
    this.orm =
      new Orm<HttpExecution>(
        Env.HTTP_REPORTING_DATABASE_ID,
        'http_executions',
        values => new HttpExecution(values as HttpExecution),
      );
  }

  public save(entity: HttpExecution): void {
    this.orm.save(entity);
  }
}
