import { Base64File } from '../../../../domain/valueobjects/Base64File';

interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
}

export class DriveStorageUtils {
  public createBlob(file: Base64File, randomFileName: boolean = false): GoogleAppsScript.Base.Blob {
    const decodedFile = Utilities.base64Decode(file.fileContent, Utilities.Charset.UTF_8);
    return Utilities
      .newBlob(decodedFile, file.mimeType, randomFileName ? file.filenameWithRandomPrefix() : file.filename);
  }

  public findOrCreateFolderInsideFolder(
    folderToSearch: string,
    folderWhereSearching: GoogleAppsScript.Drive.Folder,
  ): GoogleAppsScript.Drive.Folder {
    const foldersWithDeliverableIdIterator = folderWhereSearching.getFoldersByName(folderToSearch);

    if (foldersWithDeliverableIdIterator.hasNext()) {
      return foldersWithDeliverableIdIterator.next();
    }

    return folderWhereSearching.createFolder(folderToSearch);
  }

  public storeFilesInFolder(files: Base64File[], folder: GoogleAppsScript.Drive.Folder): void {
    const blobFiles = files.map(file => this.createBlob(file, true));
    blobFiles.forEach(blobFile => folder.createFile(blobFile));
  }

  public static iteratorToArray<T>(iterator: Iterator<T>): T[] {
    const items: T[] = [];

    while (iterator.hasNext()) {
      items.push(iterator.next());
    }

    return items;
  }

  public folderToZip(deliveryFolder: GoogleAppsScript.Drive.Folder, name: string): GoogleAppsScript.Base.Blob {
    const deliveryFolderFiles = DriveStorageUtils.iteratorToArray(deliveryFolder.getFiles());
    return Utilities.zip(deliveryFolderFiles, name);
  }

  public findFileInsideFolder(
    filename: string,
    folder: GoogleAppsScript.Drive.Folder,
  ): GoogleAppsScript.Drive.File | undefined {
    const files = folder.getFilesByName(filename);

    if (files.hasNext()) {
      return files.next();
    }

    return undefined;
  }

  public deleteFolder(folderId: string): void {
    const folder = DriveApp.getFolderById(folderId);
    folder.setTrashed(true);
  }
}
