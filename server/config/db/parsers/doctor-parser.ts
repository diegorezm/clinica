import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { doctorSchema } from "../schemas/doctor-schema";

const doctorParser = {
  insertSchema: createInsertSchema(doctorSchema).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  selectSchema: createSelectSchema(doctorSchema),
};

export default doctorParser;
