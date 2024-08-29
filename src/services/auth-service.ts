import { UserDTO } from "@/models/User";
import { LoginDTO } from "@/models/User/auth";
import userService from "./user-service";
import { TRPCError } from "@trpc/server";

class AuthService {
  async register(payload: UserDTO) {
    const userExists = await userService.getByEmail(payload.email);
    if (userExists !== undefined) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Usuário já existe.",
      });
    }
  }
  async login(payload: LoginDTO) {}
}
export default AuthService;
