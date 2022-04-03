import { RoleName } from '../../../../domain/valueobjects/RoleName';

export interface UserRoleRequest {
  roleNames: RoleName[];
  userId: string;
}