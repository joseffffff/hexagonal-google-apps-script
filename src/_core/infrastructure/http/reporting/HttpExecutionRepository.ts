import { HttpExecution } from './HttpExecution';

export interface HttpExecutionRepository {
  save(entity: HttpExecution): void;
}
