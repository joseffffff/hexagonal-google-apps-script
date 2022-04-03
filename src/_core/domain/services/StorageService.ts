import { Base64File } from '../valueobjects/Base64File';

export interface StorageService {
  store(file: Base64File): string;
}
