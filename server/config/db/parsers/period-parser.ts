import { createSelectSchema } from "drizzle-zod";
import { periodsSchema } from "../schemas/period-schema";

const periodSchema = {
  insertSchema: createSelectSchema(periodsSchema),
  selectSchema: createSelectSchema(periodsSchema),
};
export default periodSchema;
