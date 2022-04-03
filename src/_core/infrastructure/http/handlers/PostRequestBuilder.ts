import { BaseRequest } from '../requests/BaseRequest';
import { RequestBuilder } from './RequestBuilder';
import { HttpMethod } from '../HttpMethod';

export class PostRequestBuilder implements RequestBuilder {

  private readonly event: GoogleAppsScript.Events.DoPost;

  public constructor(gasEvent: GoogleAppsScript.Events.DoPost) {
    this.event = gasEvent;
  }

  public buildRequest(): BaseRequest {
    const jsonBody: string | undefined = this.event?.postData?.contents;

    if (!jsonBody) {
      return {} as BaseRequest;
    }

    return JSON.parse(jsonBody) as BaseRequest;
  }

  public method(): HttpMethod {
    return HttpMethod.POST;
  }
}
