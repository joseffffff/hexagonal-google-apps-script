import { BaseRequest } from '../BaseRequest';

export interface RegisterRequest extends BaseRequest {
  name: string;
  email: string;
  password: string;
}
