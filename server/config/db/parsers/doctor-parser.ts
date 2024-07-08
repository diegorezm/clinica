import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { doctorSchema } from "../schemas/doctor-schema";
import { z } from "zod";

const doctorParser = {
  insertSchema: createInsertSchema(doctorSchema).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  selectSchema: createSelectSchema(doctorSchema, {
    createdAt: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date(),
    ),
    updatedAt: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date(),
    ),
  }),
};

export default doctorParser;
