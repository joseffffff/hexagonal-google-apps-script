import { EntityBase } from '../../../../domain/entities/EntityBase';
import { NotFoundException } from '../../../../domain/exception/NotFoundException';
import { DatabaseRowValue, Query } from './Query';
import { Casting } from './casts/Casting';
import { DatabaseCustomFieldCaster } from './casts/DatabaseCustomFieldCaster';
import { JsonFieldCaster } from './casts/JsonFieldCaster';
import { CastingName } from './casts/CastingName';
import { InternalServerErrorException } from '../../../../domain/exception/InternalServerErrorException';
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

export class Orm<T extends EntityBase> {

  private casters: { [x: string]: DatabaseCustomFieldCaster<object /* add others */> } = {
    [CastingName.JSON]: new JsonFieldCaster(),
  };

  constructor(
    private databaseId: string,
    private table: string,
    private instantiator: (values: object) => T,
    private castings: Casting = {},
  ) {
  }

  public findAll(): T[] {
    const data = this.allSheetData();
    const headers = data.shift() as string[];
    return this.rowsToEntities(data, headers);
  }

  public delete(entity: T): boolean {
    try {
      const sheet = this.sheet();
      const allSheetData = this.allSheetDataFromSheet(sheet);
      allSheetData.shift(); // Delete Headers
      const rowNumber = this.rowNumber(allSheetData, entity);
      sheet.deleteRow(rowNumber);
      return true;
    } catch (e) {
      return false;
    }
  }

  public findById(id: string): T | undefined {
    return this.findOneByColumn('id', id);
  }

  public save(entity: T): boolean {
    entity.updatedAt = new Date();

    if (!entity.id) {
      entity.id = Utilities.getUuid();
      entity.createdAt = new Date();
      return this.create(entity);
    }

    return this.update(entity);
  }

  private create(entity: T): boolean {
    const sheet = this.sheet();
    const headers = this.headersFromSheet(sheet);
    const toSave = this.toDatabaseArrayFromHeaders(entity, headers);
    sheet.appendRow(toSave);
    return true;
  }

  public createAll(entities: T[]): boolean {

    if (entities.length === 0) {
      return true;
    }

    entities.forEach(entity => {
      entity.id = Utilities.getUuid();
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
    });

    const sheet = this.sheet();
    const data = this.allSheetDataFromSheet(sheet);
    const tableHeaders = data.shift() as string[];

    const entitiesDatabaseArrays: DatabaseRowValue[][] = entities.map(
      entity => this.toDatabaseArrayFromHeaders(entity, tableHeaders),
    );

    sheet.getRange(data.length + 2, 1, entitiesDatabaseArrays.length, tableHeaders.length)
      .setValues(entitiesDatabaseArrays);

    return true;
  }

  public allSheetDataFromSheet(sheet: Sheet): DatabaseRowValue[][] {
    return sheet.getDataRange().getValues();
  }

  private update(entity: T): boolean {
    try {
      const sheet = this.sheet();

      const data = this.allSheetDataFromSheet(sheet);
      const headers = data.shift() as string[];

      const rowNumber = this.rowNumber(data, entity);

      this.replaceValues(rowNumber, headers, sheet, entity);

      return true;
    } catch (e) {
      return false;
    }
  }

  private replaceValues(
    rowNumber: number,
    headers: string[],
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    entity: T,
  ): void {
    const values = this.toDatabaseArrayFromHeaders(entity, headers);

    values.forEach((value, index) => {
      sheet.getRange(rowNumber, index + 1).setValue(value);
    });
  }

  public updateAll(entities: T[]): boolean {

    if (entities.length === 0) {
      return true;
    }

    if (entities.some(entity => entity.id === undefined)) {
      throw new InternalServerErrorException('Cannot update entities without id.');
    }

    entities.forEach(entity => entity.updatedAt = new Date());

    const sheet = this.sheet();

    const data = this.allSheetDataFromSheet(sheet);
    const headers = data.shift() as string[];

    entities.forEach(entity => this.replaceValues(this.rowNumber(data, entity), headers, sheet, entity));

    return true;
  }

  private rowNumber(data: DatabaseRowValue[][], entity: T): number {
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === entity.id) {
        // +1 because no headers in array and +1 because row positions starts at 1
        return i + 2;
      }
    }

    throw new NotFoundException('Not found');
  }

  private toDatabaseArrayFromHeaders(entity: T, tableHeaders: string[]): DatabaseRowValue[] {
    return tableHeaders.map(header => {
      if (!!this.castings[header]) {
        const type: string = this.castings[header];
        const databaseCustomFieldCaster = this.casters[type];
        // @ts-ignore
        return databaseCustomFieldCaster.toDatabaseValue(entity[header]);
      }

      // @ts-ignore
      return entity[header];
    });
  }

  private headersFromSheet(sheet: Sheet): string[] {
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  }

  private allSheetData(): DatabaseRowValue[][] {
    return this.sheet().getDataRange().getValues();
  }

  private sheet(): Sheet {
    const db: Spreadsheet = SpreadsheetApp.openById(this.databaseId);
    return db.getSheetByName(this.table);
  }

  private rowToEntity(entityRow: DatabaseRowValue[], headers: string[]): T {
    const entity = {};

    headers.forEach((header, index) => {

      if (!!this.castings[header]) {
        const type: string = this.castings[header];
        // @ts-ignore
        // tslint:disable-next-line:no-any
        const databaseCustomFieldCaster: DatabaseCustomFieldCaster<any> = this.casters[type];
        // @ts-ignore
        entity[header] = databaseCustomFieldCaster.fromDatabaseValue(entityRow[index]);
      } else {
        // @ts-ignore
        entity[header] = entityRow[index];
      }
    });

    return this.instantiator(entity);
  }

  private rowsToEntities(entityRows: DatabaseRowValue[][], headers: string[]): T[] {
    return entityRows.map(entityRow => this.rowToEntity(entityRow, headers));
  }

  public findByColumn(column: string, value: DatabaseRowValue): T[] {
    const data = this.allSheetData();
    const headers = data.shift() as string[];

    const columnIndex = headers.indexOf(column);

    const entityRows = data.filter(row => row[columnIndex] === value);

    return this.rowsToEntities(entityRows, headers);
  }

  public findOneByColumn(column: string, value: DatabaseRowValue): T | undefined {
    const data = this.allSheetData();
    const headers = data.shift() as string[];

    const columnIndex = headers.indexOf(column);

    const entityRow = data.find(row => row[columnIndex] === value);

    if (!entityRow) {
      return undefined;
    }

    return this.rowToEntity(entityRow, headers);
  }

  public findByColumns(query: Query): T[] {
    const data = this.allSheetData();
    const headers = data.shift() as string[];

    const entityRows = data.filter(row => Object.keys(query).every(queryKey => {
      const columnIndex = headers.indexOf(queryKey);
      return row[columnIndex] === query[queryKey];
    }));

    return this.rowsToEntities(entityRows, headers);
  }

  public findOneByColumns(query: Query): T | undefined {
    const data = this.allSheetData();
    const headers = data.shift() as string[];

    const entityRow = data.find(row => Object.keys(query).every(queryKey => {
      const columnIndex = headers.indexOf(queryKey);
      return row[columnIndex] === query[queryKey];
    }));

    if (!entityRow) {
      return undefined;
    }

    return this.rowToEntity(entityRow, headers);
  }

  public findByColumnIn(column: string, values: DatabaseRowValue[]): T[] {
    const data = this.allSheetData();
    const headers = data.shift() as string[];

    const columnIndex = headers.indexOf(column);

    const entityRows = data.filter(row => values.includes(row[columnIndex]));

    return this.rowsToEntities(entityRows, headers);
  }

  public findByAllColumnsIn(query: Query): T[] {
    const data = this.allSheetData();
    const headers = data.shift() as string[];

    const entityRows = data.filter(row => Object.keys(query).every(queryKey => {
      const columnIndex: number = headers.indexOf(queryKey);
      return (query[queryKey] as DatabaseRowValue[]).includes(row[columnIndex]);
    }));

    return this.rowsToEntities(entityRows, headers);
  }

  public deleteAll(entities: T[]): boolean {

    if (entities.length === 0) {
      return true;
    }

    const sheet = this.sheet();

    const data = this.allSheetDataFromSheet(sheet);
    data.shift(); // Delete headers

    const rowNumbers = entities
      .map(entity => this.rowNumber(data, entity))
      .sort((a, b) => b - a);

    rowNumbers.forEach(rowNumber => sheet.deleteRow(rowNumber));

    return true;
  }
}
