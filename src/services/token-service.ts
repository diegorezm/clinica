import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "@/env";
import { TRPCError } from "@trpc/server";

export type TokenPayload = {
  email: string;
};

class TokenService {
  sign(email: string) {
    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    return token;
  }
  verify(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;
      const email = decoded.email as string;
      return {
        valid: true,
        expired: false,
        email,
      };
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          valid: false,
          expired: true,
          email: null,
        };
      }
      return {
        valid: false,
        expired: false,
        email: null,
      };
    }
  }
}
const tokenService = new TokenService();
export default tokenService;
