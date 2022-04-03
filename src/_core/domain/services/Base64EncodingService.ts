
export interface Base64EncodingService {
  encode(plainText: string): string;
  decode(encodedText: string): string;
}
