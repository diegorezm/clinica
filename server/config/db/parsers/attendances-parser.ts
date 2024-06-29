import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { attendancesSchema } from "../schemas/attendances-schema";

const attendancesParser = {
  insertSchema: createInsertSchema(attendancesSchema).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
  selectSchema: createSelectSchema(attendancesSchema),
};
export default attendancesParser;
