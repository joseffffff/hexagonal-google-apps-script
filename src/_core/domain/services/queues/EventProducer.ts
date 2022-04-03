import { EventBase } from './EventBase';

export interface EventProducer {
  dispatch(event: EventBase): void;
  dispatchAll(events: EventBase[]): void;
}
