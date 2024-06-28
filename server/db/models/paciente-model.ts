import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  encaminhamentosSchema,
  pacientesSchema,
} from "../schemas/paciente-schema";

const Paciente = {
  insertSchema: createInsertSchema(pacientesSchema).omit({ id: true }),
  selectSchema: createSelectSchema(pacientesSchema),
};

export const Encaminhamento = {
  insertSchema: createInsertSchema(encaminhamentosSchema),
  selectSchema: createSelectSchema(encaminhamentosSchema),
};

export default Paciente;
