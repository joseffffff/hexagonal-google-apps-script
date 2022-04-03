
export interface LoggingService {
  logs(): string[];
  log(value: string): void;
}
