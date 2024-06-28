import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { medicosSchema } from "../schemas/medico-schema";

const Medico = {
  insertSchema: createInsertSchema(medicosSchema).omit({ id: true }),
  selectSchema: createSelectSchema(medicosSchema),
};

export default Medico;
