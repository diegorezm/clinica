import {doctorWorkDaysTable} from "@/db/schema";
import {createInsertSchema} from "drizzle-zod";

export const doctorWorkDayInsertSchema =
  createInsertSchema(doctorWorkDaysTable);
export type DoctorWorkDay = typeof doctorWorkDaysTable.$inferSelect;
export type WeekDay = DoctorWorkDay["day"];
