export interface AuthService {
  generateToken(): string;
  generateTokenExpiration(): Date;
}
