import { EventBase } from './EventBase';

export interface EventProcessor<T extends EventBase> {
  consume(event: T): void;
}
