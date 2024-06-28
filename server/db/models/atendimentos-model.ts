import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { atendimentosSchema } from "../schemas/atendimentos-schema";

const Atendimento = {
  insertSchema: createInsertSchema(atendimentosSchema),
  selectSchema: createSelectSchema(atendimentosSchema),
};
export default Atendimento;
