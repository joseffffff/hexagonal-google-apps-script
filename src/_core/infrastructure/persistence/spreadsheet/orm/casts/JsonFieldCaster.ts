import { DatabaseCustomFieldCaster } from './DatabaseCustomFieldCaster';

export class JsonFieldCaster implements DatabaseCustomFieldCaster<object> {

  public fromDatabaseValue(value: string): object | undefined {
    if (!value) {
      return undefined;
    }

    return JSON.parse(value);
  }

  public toDatabaseValue(value: object): string {
    return JSON.stringify(value);
  }
}
