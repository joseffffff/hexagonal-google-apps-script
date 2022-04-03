import { GoogleAuthValidationResponse } from '../../../../../src/_core/domain/valueobjects/GoogleAuthValidationResponse';
import { mock } from 'jest-mock-extended';
import { UserRepository } from '../../../../../src/_core/domain/services/repositories/UserRepository';
import { UserService } from '../../../../../src/_core/domain/services/entityservices/UserService';
import { ValidationException } from '../../../../../src/_core/domain/exception/ValidationException';
import { User } from '../../../../../src/_core/domain/entities/User';
import { Env } from '../../../../../src/env';

describe('User service testing', () => {

  let tokenData: GoogleAuthValidationResponse;

  beforeEach(() => {
    tokenData = {
      iss: '',
      sub: '',
      azp: '',
      aud: '',

      email: 'johnDoe@gmail.com',
      email_verified: true,

      at_hash: '',

      name: 'John Doe',
      picture: '<url picture>',
      given_name: 'John',
      locale: 'en',
      iat: 1234,
      exp: '',
      jti: '',
    };
  });

  test('create from google token', () => {

    const mockUserRepository = mock<UserRepository>();

    const userService = new UserService(mockUserRepository, Env.DEFAULT_USER_IMG);

    const createdUser = userService.createFromTokenData({
      ...tokenData,
    });

    expect(createdUser.name).toBe(tokenData.name);
    expect(createdUser.email).toBe(tokenData.email);
    expect(createdUser.picture).toBe(tokenData.picture);
    expect(createdUser.isGoogleUser).toBe(true);
    expect(createdUser.googleId).toBe(tokenData.sub);
  });

  test('throws with a not validated email token data', () => {
    const mockUserRepository = mock<UserRepository>();

    const userService = new UserService(mockUserRepository, Env.DEFAULT_USER_IMG);

    expect(() => {
      userService.createFromTokenData({
        ...tokenData,
        email_verified: false,
      });
    }).toThrow(ValidationException);
  });

  test('getOrCreateFromTokenData with non existing user', () => {
    const mockUserRepository = mock<UserRepository>();
    mockUserRepository.findByEmail.mockReturnValue(undefined);

    const userService = new UserService(mockUserRepository, Env.DEFAULT_USER_IMG);

    const createdUser = userService.getOrCreateFromTokenData({
      ...tokenData,
    });

    expect(createdUser.name).toBe(tokenData.name);
    expect(createdUser.email).toBe(tokenData.email);
    expect(createdUser.picture).toBe(tokenData.picture);
    expect(createdUser.isGoogleUser).toBe(true);
    expect(createdUser.googleId).toBe(tokenData.sub);
  });

  test('getOrCreateFromTokenData with existing user', () => {
    const user = new User({
      name: 'John Donete',
      email: 'john@donete.com',
      isGoogleUser: false,
    });

    const mockUserRepository = mock<UserRepository>();
    mockUserRepository.findByEmail.mockReturnValue(user);

    const userService = new UserService(mockUserRepository, Env.DEFAULT_USER_IMG);

    const createdUser = userService.getOrCreateFromTokenData({
      ...tokenData,
    });

    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.isGoogleUser).toBe(user.isGoogleUser);
  });

  test('Should update user if existing user is a Draft', () => {
    const user = new User({
      name: '',
      email: 'john@donete.com',
      isDraft: true,
    });

    const mockUserRepository = mock<UserRepository>();
    mockUserRepository.findByEmail.mockReturnValue(user);

    const userService = new UserService(mockUserRepository, Env.DEFAULT_USER_IMG);

    const createdUser = userService.getOrCreateFromTokenData({
      ...tokenData,
    });

    expect(createdUser.name).toBe(tokenData.name);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.isGoogleUser).toBe(true);
    expect(createdUser.isDraft).toBe(false);
    expect(createdUser.picture).toBe(tokenData.picture);
    expect(createdUser.googleId).toBe(tokenData.sub);
  });
});
