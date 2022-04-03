import { MailEmitter } from '../../../domain/services/MailEmitter';

export class GasMailEmitter implements MailEmitter {

  public canSendEmail(): boolean {
    return MailApp.getRemainingDailyQuota() > 0;
  }

  public send(to: string, subject: string, body: string): void {
    MailApp.sendEmail(to, subject, body)
  }
}
