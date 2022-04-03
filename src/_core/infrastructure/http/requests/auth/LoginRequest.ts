import { BaseRequest } from '../BaseRequest';

export interface LoginRequest extends BaseRequest {
  email: string;
  password: string;
}
