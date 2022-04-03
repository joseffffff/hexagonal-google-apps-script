import { User } from '../../entities/User';
import { GoogleAuthValidationResponse } from '../../valueobjects/GoogleAuthValidationResponse';
import { UserRepository } from '../repositories/UserRepository';
import { ValidationException } from '../../exception/ValidationException';
import { Env } from '../../../../env';

export class UserService {

  public constructor(
    private readonly userRepository: UserRepository,
    private defaultUserImage: string = Env.DEFAULT_USER_IMG,
  ) {
  }

  public getOrCreateFromTokenData(tokenData: GoogleAuthValidationResponse): User {
    const user: User | undefined = this.userRepository.findByEmail(tokenData.email);

    if (!user) {
      return this.createFromTokenData(tokenData);
    }

    if (user.isDraft) {
      return this.updateUserFromTokenData(tokenData, user);
    }

    return user;
  }

  public createFromTokenData(tokenData: GoogleAuthValidationResponse): User {

    if (!tokenData.email_verified) {
      throw new ValidationException('Token email not verified.');
    }

    return new User({
      name: tokenData.name,
      email: tokenData.email,
      picture: tokenData.picture,
      isGoogleUser: true,
      googleId: tokenData.sub,
    });
  }

  public buildDraftUser(email: string): User {
    return new User({
      name: '',
      email,
      isDraft: true,
      picture: this.defaultUserImage,
    });
  }

  private updateUserFromTokenData(tokenData: GoogleAuthValidationResponse, user: User): User {

    user.name = tokenData.name;
    user.email = tokenData.email;
    user.picture = tokenData.picture;
    user.isGoogleUser = true;
    user.googleId = tokenData.sub;
    user.isDraft = false;

    return user;
  }
}
