import { AuthService } from '../../../domain/services/AuthService';
import { Env } from '../../../../env';

export class GasAuthService implements AuthService {
  public generateToken(): string {
    return Utilities.getUuid();
  }

  public generateTokenExpiration(): Date {
    const duration = new Date();
    const time = duration.getTime();

    duration.setTime(time + (60 * 60 * 1000 * Env.TOKEN_EXPIRATION))

    return duration;
  }
}
