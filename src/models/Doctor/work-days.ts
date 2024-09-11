import { doctorWorkDaysTable } from "@/db/schema";

export type DoctorWorkDay = typeof doctorWorkDaysTable.$inferSelect;
export type WeekDay = DoctorWorkDay["day"];
