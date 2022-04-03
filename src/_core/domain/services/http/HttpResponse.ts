export interface HttpResponse<T> {
  code: number;
  headers: object,
  content: string;
  jsonContent: T;
}
