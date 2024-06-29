import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { workDaysSchema } from "../schemas/work-day-schema";

const workdayParser = {
  insertSchema: createInsertSchema(workDaysSchema),
  selectSchema: createSelectSchema(workDaysSchema),
};
export default workdayParser;
