import { HashingService } from '../../../domain/services/HashingService';

export class GasHashingService implements HashingService {

  public check(plainText: string, hashedText: string): boolean {
    return this.hash(plainText) === hashedText;
  }

  public hash(plainText: string): string {
    const rawHash: number[] = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, plainText);

    let txtHash = '';

    for (let hashVal of rawHash) {
      if (hashVal < 0) {
        hashVal += 256;
      }

      if (hashVal.toString(16).length === 1) {
        txtHash += '0';
      }

      txtHash += hashVal.toString(16);
    }

    return txtHash;
  }
}
