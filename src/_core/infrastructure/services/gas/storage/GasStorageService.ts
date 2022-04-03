import { StorageService } from '../../../../domain/services/StorageService';
import { Base64File } from '../../../../domain/valueobjects/Base64File';
import { Env } from '../../../../../env';
import { DriveStorageUtils } from './DriveStorageUtils';

export class GasStorageService implements StorageService {

  constructor(
    private driveStorageUtils = new DriveStorageUtils(),
  ) {
  }

  public store(file: Base64File): string {
    const blob = this.driveStorageUtils.createBlob(file);

    const driveFile: GoogleAppsScript.Drive.File = DriveApp.getFolderById(Env.UPLOADS_FOLDER).createFile(blob);
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return driveFile.getDownloadUrl();
  }
}
