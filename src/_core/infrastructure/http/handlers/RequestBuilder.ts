import { BaseRequest } from '../requests/BaseRequest';
import { HttpMethod } from '../HttpMethod';

export interface RequestBuilder {
  buildRequest(): BaseRequest;
  method(): HttpMethod;
}
