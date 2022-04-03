import { User } from '../../../../domain/entities/User';

export class UserResource {
  public readonly id: string;
  public readonly createdAt: string;
  public readonly name: string;
  public readonly email: string;
  public readonly token?: string;
  public readonly tokenExpiration?: string;
  public readonly picture: string;
  public readonly isGoogleUser: boolean;
  public readonly roles: string[];

  constructor(user: User) {
    this.id = user.id;
    this.createdAt = user.createdAt.toISOString();
    this.name = user.name;
    this.email = user.email;
    this.token = user.token;
    this.tokenExpiration = !!user.tokenExpiration ? user.tokenExpiration.toISOString() : undefined;
    this.picture = user.picture;
    this.isGoogleUser = user.isGoogleUser;

    if (user.hasRoles()) {
      this.roles = user.roles.map(role => role.name);
    }
  }
}
