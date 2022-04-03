import { BaseRequest } from '../requests/BaseRequest';
import { RequestBuilder } from './RequestBuilder';
import { HttpMethod } from '../HttpMethod';

interface QueryParams {
  [x: string]: string[];
}

export class GetRequestBuilder implements RequestBuilder {

  private event: GoogleAppsScript.Events.DoGet;

  public constructor(gasEvent: GoogleAppsScript.Events.DoGet) {
    this.event = gasEvent;
  }

  public buildRequest(): BaseRequest {

    const params: QueryParams | undefined = this.event?.parameters as QueryParams;

    const request: {[x: string]: string} = {};

    if (!!params) {
      Object.keys(params).forEach(param => {
        request[param] = params[param][0];
      });
    }

    return request as object as BaseRequest;
  }

  public method(): HttpMethod {
    return HttpMethod.GET;
  }
}
