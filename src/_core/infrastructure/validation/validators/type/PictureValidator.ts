import { BaseTypeValidator } from './BaseTypeValidator';
import { Base64FileRequest } from '../../../http/requests/common/Base64FileRequest';
import { RequestFieldType } from '../../RequestFieldType';
import { ValidationError } from '../../ValidationError';

export class PictureValidator implements BaseTypeValidator<Base64FileRequest> {

  private readonly validMimeTypes: string[] = [
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/x-icon',
  ];

  private readonly validExtensions: string[] = [
    '.bmp', '.gif', '.jpe', '.jpeg', '.jpg', '.svg', '.tif', '.tiff', '.png', '.ico',
  ];

  public error(type: RequestFieldType): ValidationError {
    return ValidationError.PICTURE;
  }

  public isValid(value: Base64FileRequest): boolean {
    const hasValidFields = !!value.filename && !!value.fileContent && !!value.mimeType;
    const hasValidImageContent = value.fileContent.length > 100;
    const hasValidMimeType = this.validMimeTypes.includes(value.mimeType);
    const hasValidExtension = this.validExtensions.some(extension => value.filename.endsWith(extension));

    return hasValidFields && hasValidImageContent && hasValidMimeType && hasValidExtension;
  }
}
