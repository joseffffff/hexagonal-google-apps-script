import { ExcelJobRepository } from './repositories/ExcelJobRepository';
import { EventBase } from '../../domain/services/queues/EventBase';
import { GeneralFactory } from '../factories/GeneralFactory';
import { EventType } from '../../domain/valueobjects/EventType';
import { EventProcessor } from '../../domain/services/queues/EventProcessor';

export class DatabaseEventConsumer {

  public constructor(
    private jobRepository = new ExcelJobRepository(),
    private generalFactory = new GeneralFactory(),
  ) {
  }

  public consume(): void {
    const processors = this.generalFactory.mountEntrypoints().processors;

    const jobs = this.jobRepository.findAll();

    for (const job of jobs) {
      // try {
      const payload = JSON.parse(job.payload) as EventBase;
      const processor: EventProcessor<EventBase> = processors[payload.type as EventType];

      if (!!processor) {
        processor.consume(payload);
        this.jobRepository.delete(job);
      }
      // Save this on a success_jobs table
      // } catch (e) {
      //   // Save this on a failed_jobs table
      // }
    }
  }
}
