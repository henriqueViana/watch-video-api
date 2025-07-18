import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}