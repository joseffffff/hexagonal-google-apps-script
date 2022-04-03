import { BaseResource } from '../BaseResource';

export class NoActionResource extends BaseResource<string> {
  public constructor(msg: string) {
    super(401, msg);
  }
}
