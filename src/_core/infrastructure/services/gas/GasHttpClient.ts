import { HttpClient } from '../../../domain/services/http/HttpClient';
import { HttpParams } from '../../../domain/services/http/HttpParams';
import { HttpResponse } from '../../../domain/services/http/HttpResponse';
import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;

export class GasHttpClient implements HttpClient {
  public get<T>(url: string, params?: HttpParams): HttpResponse<T> {

    const response: HTTPResponse = UrlFetchApp.fetch(url, {
      'method': 'get',
      'payload': params ?? {},
    });

    const content = response.getContentText('utf-8');

    return {
      code: response.getResponseCode(),
      headers: response.getAllHeaders(),
      content,
      jsonContent: JSON.parse(content),
    };
  }
}
