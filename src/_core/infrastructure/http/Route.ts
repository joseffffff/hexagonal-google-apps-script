import { ApiAction } from '../../../ApiAction';
import { HttpMethod } from './HttpMethod';
import { RoleName } from '../../domain/valueobjects/RoleName';

export interface Route {
  action: ApiAction;
  requireAuth: boolean;
  method: HttpMethod;
  controller: string;
  controllerMethod: string;
  // routes version
  roles?: RoleName[];
}
