import { HTTPException } from "hono/http-exception";

export class DoctorAlreadyExistsException extends HTTPException {
  constructor() {
    super(404, { message: "Este médico já existe." });
  }
}
