import { HTTPException } from "hono/http-exception";

export class UserAlreadyExistsException extends HTTPException {
  constructor() {
    super(403, { message: "Este email já foi cadastrado." });
  }
}
