import { HTTPException } from "hono/http-exception";

export class RoleNotFoundException extends HTTPException {
  constructor() {
    super(404, { message: "Este cargo não existe." });
  }
}
