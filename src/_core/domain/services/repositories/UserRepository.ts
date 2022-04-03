import { Repository } from './Repository';
import { User } from '../../entities/User';

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): User | undefined;
  findByToken(token: string): User | undefined;
}
