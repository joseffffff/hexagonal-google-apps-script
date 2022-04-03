import { GetRequestBuilder, HttpExecutionsReporter, PostRequestBuilder, RequestHandler } from './src/_core/infrastructure/http';
import { DatabaseEventConsumer } from './src/_core/infrastructure/queues/DatabaseEventConsumer';
import { GasLoggingService } from './src/_core/infrastructure/services/gas/GasLoggingService';
import { ExcelUserRepository } from './src/_core/infrastructure/persistence/spreadsheet/repositories/ExcelUserRepository';
import { RoutesProvider } from './src/RoutesProvider';
import { GeneralFactory } from './src/_core/infrastructure/factories/GeneralFactory';
import { RoleService } from './src/_core/domain/services/entityservices/RoleService';
import { ExcelRoleUserRepository } from './src/_core/infrastructure/persistence/spreadsheet/repositories/ExcelRoleUserRepository';
import { ExcelRoleRepository } from './src/_core/infrastructure/persistence/spreadsheet/repositories/ExcelRoleRepository';
import { ExcelHttpExecutionRepository } from './src/_core/infrastructure/http/reporting/ExcelHttpExecutionRepository';

// @ts-ignore
function doGet(event: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  Logger.log('Starting request.');
  const requestHandler = new RequestHandler(
    new GetRequestBuilder(event),
    new RoutesProvider(),
    new GeneralFactory(),
    new ExcelUserRepository(),
    new GasLoggingService(),
    new RoleService(
      new ExcelRoleRepository(),
      new ExcelRoleUserRepository(),
    ),
    new HttpExecutionsReporter(new ExcelHttpExecutionRepository()),
  );
  const response = requestHandler.processRequest();
  const jsonString = JSON.stringify(response);
  return ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
}

// @ts-ignore
function doPost(event: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  Logger.log('Starting request.');
  const requestHandler = new RequestHandler(
    new PostRequestBuilder(event),
    new RoutesProvider(),
    new GeneralFactory(),
    new ExcelUserRepository(),
    new GasLoggingService(),
    new RoleService(
      new ExcelRoleRepository(),
      new ExcelRoleUserRepository(),
    ),
    new HttpExecutionsReporter(new ExcelHttpExecutionRepository()),
  );
  const response = requestHandler.processRequest();
  const jsonString = JSON.stringify(response);
  return ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
}

// @ts-ignore
function consumeJobs(): void {
  const eventConsumer = new DatabaseEventConsumer();
  eventConsumer.consume();
}
