
export interface GoogleAuthValidationResponse {
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  hd?: string; // only for gsuite accounts

  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name?: string; // only for gsuite accounts
  locale: string;
  iat: number;
  exp: string;
  jti: string;
}
