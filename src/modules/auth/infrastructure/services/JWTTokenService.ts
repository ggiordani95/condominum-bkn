import jwt from "jsonwebtoken";
import { TokenService } from "../../application/use-cases/LoginUseCase";

export class JWTTokenService implements TokenService {
  constructor(
    private secret: string,
    private expiresIn: string = "24h"
  ) {}

  async generateToken(userId: string, email: string): Promise<string> {
    const payload = {
      userId,
      email,
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  async verifyToken(
    token: string
  ): Promise<{ userId: string; email: string } | null> {
    try {
      const decoded = jwt.verify(token, this.secret) as {
        userId: string;
        email: string;
      };

      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch {
      return null;
    }
  }
}
