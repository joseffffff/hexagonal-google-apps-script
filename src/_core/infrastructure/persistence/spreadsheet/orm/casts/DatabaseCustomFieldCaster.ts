export interface DatabaseCustomFieldCaster<T> {
  toDatabaseValue(value: T): string;
  fromDatabaseValue(value: string): T;
}
