export interface MailEmitter {
  canSendEmail(): boolean;
  send(to: string, subject: string, body: string): void;
}
