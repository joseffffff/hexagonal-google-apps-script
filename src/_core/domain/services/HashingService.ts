export interface HashingService {
  hash(plainText: string): string;
  check(plainText: string, hashedText: string): boolean;
}
