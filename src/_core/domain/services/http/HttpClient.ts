import { HttpResponse } from './HttpResponse';
import { HttpParams } from './HttpParams';

export interface HttpClient {
  get<T>(url: string, params?: HttpParams): HttpResponse<T>;
  // post(url: string, params?: HttpParams): HttpResponse; NOT IMPLEMENTED
}
