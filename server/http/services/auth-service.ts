import { hash, genSalt, compare } from "bcryptjs";

class AuthService {
  async hashPassword(password: string) {
    const salt = await genSalt(8);
    return hash(password, salt);
  }
  async comparePassword(password: string, passwordHash: string) {
    return await compare(password, passwordHash);
  }
  async genToken() {
    throw new Error("Unimplemented");
  }
  async validateToken() {
    throw new Error("Unimplemented");
  }
}

export default new AuthService();
