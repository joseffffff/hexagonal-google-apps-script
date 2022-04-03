import { User } from '../../../../domain/entities/User';

export class SimpleUserResource {
  public readonly id: string;
  public readonly createdAt: string;
  public readonly name: string;
  public readonly email: string;
  public readonly picture: string;
  public readonly roles?: string[];

  constructor(user: User) {
    this.id = user.id;
    this.createdAt = user.createdAt.toISOString();
    this.name = user.name;
    this.email = user.email;
    this.picture = user.picture;

    if (user.hasRoles()) {
      this.roles = user.roles.map(role => role.name);
    }
  }
}
