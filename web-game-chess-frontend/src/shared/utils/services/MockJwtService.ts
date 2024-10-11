import { Guid } from "guid-typescript";
import jwt from "jsonwebtoken";

// user object
export interface MockUser {
  id: Guid;
  username: string;
  role: {
    name: string;
  };
  isVerified: boolean;
}

interface AuthenticationSettings {
  jwtKey: string;
  jwtIssuer: string;
  jwtExpireDays: number;
}

export class JwtService {
  private authenticationSettings: AuthenticationSettings = {
    jwtKey: "test-secret-key",
    jwtIssuer: "test-issuer",
    jwtExpireDays: 7,
  };

  constructor() {}

  public getJwtToken(user: MockUser): string {
    const claims = {
      id: user.id,
      username: user.username,
      role: user.role.name,
      isVerified: user.isVerified,
    };

    const expiresIn = this.authenticationSettings.jwtExpireDays * 24 * 60 * 60;

    const token = jwt.sign(claims, this.authenticationSettings.jwtKey, {
      expiresIn: expiresIn,
      issuer: this.authenticationSettings.jwtIssuer,
    });

    return token;
  }
}
