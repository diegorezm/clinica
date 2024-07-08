import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { attendancesSchema } from "../schemas/attendances-schema";
import { z } from "zod";

const attendancesParser = {
  insertSchema: createInsertSchema(attendancesSchema, {
    appointmentDate: z.date(),
  }).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  selectSchema: createSelectSchema(attendancesSchema, {
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
export default attendancesParser;
