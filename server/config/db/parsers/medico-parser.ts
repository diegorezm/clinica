import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { medicosSchema } from "../schemas/medico-schema";

const medicoParser = {
  insertSchema: createInsertSchema(medicosSchema).omit({
    id: true,
    createdAt: true,
  }),
  selectSchema: createSelectSchema(medicosSchema),
};

export default medicoParser;
