import { BaseRequest } from '../BaseRequest';

export interface UserIdRequest extends BaseRequest {
  userId: string;
}
