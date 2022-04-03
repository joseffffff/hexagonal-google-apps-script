import { EventProducer } from '../../domain/services/queues/EventProducer';
import { EventBase } from '../../domain/services/queues/EventBase';
import { Job } from './entities/Job';
import { ExcelJobRepository } from './repositories/ExcelJobRepository';

export class DatabaseEventProducer implements EventProducer {

  public constructor(
    private jobRepository = new ExcelJobRepository(),
  ) {
  }

  public dispatch(event: EventBase): void {
    const job = new Job({
      payload: JSON.stringify(event),
    });

    this.jobRepository.save(job);
  }

  public dispatchAll(events: EventBase[]): void {
    const jobs = events.map(event => new Job({ payload: JSON.stringify(event) }));
    this.jobRepository.createAll(jobs);
  }
}
