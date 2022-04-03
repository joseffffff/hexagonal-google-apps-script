import { EntityBase, IEntityBase } from './EntityBase';
import { Role } from './Role';
import { RoleName } from '../valueobjects/RoleName';

export interface IUser extends IEntityBase {
  name: string;
  email: string;
  password?: string;
  token?: string;
  tokenExpiration?: Date;
  picture?: string;
  isGoogleUser?: boolean;
  googleId?: string;
  roles?: Role[];
  isDraft?: boolean;
}

export class User extends EntityBase {
  public name: string;
  public email: string;
  public password?: string;
  public token?: string;
  public tokenExpiration?: Date;
  public picture?: string;
  public isGoogleUser?: boolean;
  public googleId?: string;
  public isDraft: boolean;

  public roles?: Role[];

  public constructor(entity: IUser) {
    super(entity);
    this.name = entity.name;
    this.email = entity.email;
    this.password = entity.password;
    this.token = entity.token;
    this.tokenExpiration = entity.tokenExpiration;
    this.picture = entity.picture;
    this.isGoogleUser = !!entity.isGoogleUser;
    this.googleId = entity.googleId;
    this.isDraft = !!entity.isDraft;

    this.roles = entity.roles;
  }

  public setRoles(userRoles: Role[]): void {
    this.roles = userRoles;
  }

  public addRole(role: Role): void {
    if (!this.hasRoles()) {
      this.setRoles([]);
    }

    this.roles.push(role);
  }

  public hasRoles(): boolean {
    return !!this.roles && Array.isArray(this.roles);
  }

  public hasRole(roleName: RoleName): boolean {
    if (!this.hasRoles()) {
      return false;
    }

    return this.roles.some(role => role.name === roleName);
  }

  public hasSuperAdminRole(): boolean {
    return this.hasRole(RoleName.SUPER_ADMIN);
  }

  public hasOneOfThisRoles(roles: RoleName[]): boolean {
    return this.roles
      ?.map(role => role.name)
      .some(role => roles.includes(role)) ?? false;
  }
}
