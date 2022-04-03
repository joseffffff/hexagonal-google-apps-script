import { Repository } from './Repository';
import { Role } from '../../entities/Role';
import { RoleName } from '../../valueobjects/RoleName';

export interface RoleRepository extends Repository<Role> {
  findByName(roleName: RoleName): Role | undefined;
  findByNameIn(roleName: RoleName[]): Role[];
}
