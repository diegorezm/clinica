import { HTTPException } from "hono/http-exception";

export class AttendanceNotFoundException extends HTTPException {
  constructor() {
    super(404, { message: "Esta consulta não existe." });
  }
}
