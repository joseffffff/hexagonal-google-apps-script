import { StringHelper } from '../services/helpers/StringHelper';

interface Base64FileProperties {
  filename: string;
  fileContent: string;
  mimeType: string;
}

export class Base64File {
  filename: string;
  fileContent: string;
  mimeType: string;

  public constructor(file: Base64FileProperties) {
    this.filename = file.filename;
    this.fileContent = file.fileContent;
    this.mimeType = file.mimeType;
  }

  public filenameWithRandomPrefix(): string {
    return `${StringHelper.random(5)}-${this.filename}`;
  }
}
