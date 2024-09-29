import {doctorWorkPeriodTable} from "@/db/schema";
import {createInsertSchema} from "drizzle-zod";

export const doctorWorkPeriodInsertSchema = createInsertSchema(
  doctorWorkPeriodTable,
);
export type DoctorWorkPeriod = typeof doctorWorkPeriodTable.$inferSelect;
export type Period = DoctorWorkPeriod["period"];
