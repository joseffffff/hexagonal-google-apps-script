import { UserRepository } from '../../../../domain/services/repositories/UserRepository';
import { IUser, User } from '../../../../domain/entities/User';
import { ExcelBaseRepository } from './ExcelBaseRepository';

export class ExcelUserRepository extends ExcelBaseRepository<User> implements UserRepository {

  public constructor() {
    super('users', values => new User(values as IUser));
  }

  public findByEmail(email: string): User | undefined {
    return this.findAll().find(user => user.email === email);
  }

  public findByToken(token: string): User | undefined {

    const user: User | undefined = this.orm.findOneByColumn('token', token);

    if (!!user && user.tokenExpiration?.getTime() > new Date().getTime()) {
      return user;
    }

    return undefined;
  }
}
