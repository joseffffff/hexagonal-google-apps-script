import { User } from '../../../src/_core/domain/entities/User';
import { RoleName } from '../../../src/_core/domain/valueobjects/RoleName';
import { RoleBuilder } from './RoleBuilder';

import faker from 'faker';
import { Role } from '../../../src/_core/domain/entities/Role';
import { EntityBuilder } from './EntityBuilder';

export class UserBuilder extends EntityBuilder<User> {

  private name: string = faker.name.findName();
  private email: string = faker.internet.email();
  private picture: string = faker.image.imageUrl();

  private token: string = faker.datatype.uuid();
  private tokenExpiration: Date;

  private isGoogleUser: boolean = false;
  private isDraft: boolean = false;

  private roles: Role[] = [];

  public build(): User {
    return new User({
      ...this.buildBaseFields(),
      name: this.name,
      email: this.email,
      picture: this.picture,
      token: this.token,
      tokenExpiration: this.tokenExpiration,
      isGoogleUser: this.isGoogleUser,
      isDraft: this.isDraft,
      roles: this.roles,
    });
  }

  public withIsGoogleUser(isGoogleUser: boolean): UserBuilder {
    this.isGoogleUser = isGoogleUser;
    return this;
  }

  public static instance(): UserBuilder {
    return new UserBuilder();
  }

  public withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  public withIsDraft(isDraft: boolean): UserBuilder {
    this.isDraft = isDraft;
    return this;
  }

  public withRole(roleName: RoleName): UserBuilder {
    const role = RoleBuilder.instance().withRoleName(roleName).build();
    this.roles.push(role);
    return this;
  }

  public withName(name: string): UserBuilder {
    this.name = name;
    return this;
  }
}
