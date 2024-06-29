import { HTTPException } from "hono/http-exception";

export class DoctorNotFoundException extends HTTPException {
  constructor() {
    super(404, { message: "Este médico não existe." });
  }
}
