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
  selectSchema: createSelectSchema(attendancesSchema),
};
export default attendancesParser;
