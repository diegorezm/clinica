import { HTTPException } from "hono/http-exception";

export class PatientNotFoundException extends HTTPException {
  constructor() {
    super(404, { message: "Este paciente não existe." });
  }
}
