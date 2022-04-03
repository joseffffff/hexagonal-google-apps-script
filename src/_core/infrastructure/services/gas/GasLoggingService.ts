import { LoggingService } from '../../../domain/services/LoggingService';

export class GasLoggingService implements LoggingService {

  public log(value: string): void {
    Logger.log(value);
  }

  public logs(): string[] {
    const log: string = Logger.getLog();

    if (!log.includes('\n')) {
      return [ log ];
    }

    return log.split('\n').filter(value => value !== '');
  }
}
