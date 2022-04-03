import { Env } from '../../../../env';
import { User } from '../../entities/User';
import { MailEmitter } from '../MailEmitter';

export class UsersEmailService {

  constructor(
    private mailEmitter: MailEmitter,
    private frontendURL: string = Env.FRONTEND_URL,
  ) {
  }

  public sendUserInvitationEmail(user: User): void {
    this.mailEmitter.send(
      user.email,
      'Invitation',
      `Welcome ${this.frontendURL}`,
    )
  }
}
