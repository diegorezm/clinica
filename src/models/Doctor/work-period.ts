import { doctorWorkPeriodTable } from "@/db/schema";

export type DoctorWorkPeriod = typeof doctorWorkPeriodTable.$inferSelect;
export type Period = DoctorWorkPeriod["period"];
