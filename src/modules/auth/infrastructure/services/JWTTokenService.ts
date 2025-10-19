import { TokenService } from "../../application/use-cases/LoginUseCase";

export class JWTTokenService implements TokenService {
  constructor(private secret: string) {}

  async generateToken(userId: string, email: string): Promise<string> {
    const payload = {
      userId,
      email,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    return `jwt_${btoa(JSON.stringify(payload))}`;
  }

  async verifyToken(
    token: string
  ): Promise<{ userId: string; email: string } | null> {
    try {
      if (!token.startsWith("jwt_")) {
        return null;
      }

      const payload = JSON.parse(atob(token.substring(4)));

      if (payload.exp < Date.now()) {
        return null; // Token expired
      }

      return {
        userId: payload.userId,
        email: payload.email,
      };
    } catch {
      return null;
    }
  }
}
