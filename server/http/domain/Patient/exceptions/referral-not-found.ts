import { HTTPException } from "hono/http-exception";

export class ReferralNotFoundException extends HTTPException {
  constructor() {
    super(404, { message: "Este encaminhamento não existe." });
  }
}
