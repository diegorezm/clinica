import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { atendimentosSchema } from "../schemas/atendimentos-schema";

const atendimentoParser = {
  insertSchema: createInsertSchema(atendimentosSchema),
  selectSchema: createSelectSchema(atendimentosSchema),
};
export default atendimentoParser;
