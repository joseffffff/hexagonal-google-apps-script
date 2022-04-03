import { Base64EncodingService } from '../../../domain/services/Base64EncodingService';

export class GasBase64Encoder implements Base64EncodingService {
  public decode(encodedText: string): string {
    return Utilities.base64DecodeWebSafe(encodedText).map(char => String.fromCharCode(char)).join('');
  }

  public encode(plainText: string): string {
    return Utilities.base64Encode(plainText);
  }
}
