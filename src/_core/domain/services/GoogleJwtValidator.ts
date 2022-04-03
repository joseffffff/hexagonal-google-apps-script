import { GoogleAuthValidationResponse } from '../valueobjects/GoogleAuthValidationResponse';
import { ValidationException } from '../exception/ValidationException';
import { HttpResponse } from './http/HttpResponse';
import { Env } from '../../../env';
import { HttpClient } from './http/HttpClient';

export class GoogleJwtValidator {

  public constructor(
    private readonly httpClient: HttpClient,
    // private readonly base64EncodingService: Base64EncodingService,
    private readonly googleClientId: string = Env.GOOGLE_CLIENT_ID,
  ) {
  }

  public validate(token: string): GoogleAuthValidationResponse {
    this.validateTokenFormatOrFail(token);

    // Pending to check if this works ok.
    const tokenData: GoogleAuthValidationResponse = this.validateTokenAndGetData(token);

    this.validateTokenFieldsOrFail(tokenData);

    return tokenData;
  }

  private validateTokenFormatOrFail(token: string): void {
    if (!token || !token.includes('.')) {
      throw new ValidationException('Invalid token');
    }
  }

  private validateTokenAndGetData(token: string): GoogleAuthValidationResponse {

    const response: HttpResponse<GoogleAuthValidationResponse> = this.httpClient.get<GoogleAuthValidationResponse>(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    );

    if (response.code !== 200) {
      throw new ValidationException('Invalid token.');
    }

    // const [ encodedHeaders, encodedPayload, encodedSignature ] = token.split('.');
    //
    // const headers: string = this.base64EncodingService.decode(encodedHeaders);
    // const tokenPayload: string = this.base64EncodingService.decode(encodedPayload);

    return response.jsonContent;
  }

  private validateTokenFieldsOrFail(tokenData: GoogleAuthValidationResponse): void {
    const expiration = new Date(Number(tokenData.exp + '000'));
    const now = new Date();

    if (expiration.getTime() < now.getTime()) {
      throw new ValidationException('Invalid token.');
    }

    if (tokenData.aud !== this.googleClientId) {
      throw new ValidationException('Invalid token.');
    }

    if (tokenData.iss !== 'accounts.google.com' && tokenData.iss !== 'https://accounts.google.com') {
      throw new ValidationException('Invalid token.');
    }

    if (!tokenData.email_verified) {
      throw new ValidationException('Invalid token.');
    }

    // Validate xtec domain????
  }
}
