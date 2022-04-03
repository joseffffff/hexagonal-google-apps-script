import { Environment } from './_core/domain/valueobjects/Environment';

export class Env {
  public static readonly TOKEN_EXPIRATION: number = 72;
  public static readonly DATABASE_ID: string = '';
  public static readonly SHOW_LOGS: boolean = true; // false in production
  public static readonly GOOGLE_CLIENT_ID: string = '';
  public static readonly UPLOADS_FOLDER: string = '';
  public static readonly FRONTEND_URL: string = '';
  public static readonly DEFAULT_USER_IMG: string = '';
  public static readonly ENVIRONMENT: Environment = Environment.DEVELOPMENT;
  public static readonly HTTP_REPORTING_DATABASE_ID: string = '';
}
