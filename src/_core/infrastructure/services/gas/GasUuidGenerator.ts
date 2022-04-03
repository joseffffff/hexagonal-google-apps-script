import { UuidGenerator } from '../../../domain/services/UuidGenerator';

export class GasUuidGenerator implements UuidGenerator {
  public generate(): string {
    return Utilities.getUuid();
  }
}
