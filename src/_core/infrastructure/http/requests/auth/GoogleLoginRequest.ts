import { BaseRequest } from '../BaseRequest';

export interface GoogleLoginRequest extends BaseRequest {
  googleToken: string;
}
