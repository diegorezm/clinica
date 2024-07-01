import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { referralsSchema } from "../schemas/referrals-schema";

const referralsParser = {
  insertSchema: createInsertSchema(referralsSchema).omit({ id: true }),
  selectSchema: createSelectSchema(referralsSchema),
};

export default referralsParser;
