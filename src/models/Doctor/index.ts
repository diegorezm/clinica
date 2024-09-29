import {doctorsTable} from "@/db/schema";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";
import {User, userInsertSchema} from "../User";
import {Period} from "./work-period";
import {WeekDay} from "./work-days";

export const doctorInsertSchema = createInsertSchema(doctorsTable, {
  crm: z.string().min(9),
  jobFunction: z.string().min(3),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const doctorWithUserSchema = z.object({
  user: userInsertSchema,
  doctor: doctorInsertSchema,
});

type DoctorRaw = typeof doctorsTable.$inferSelect;

export interface Doctor extends Omit<User, "id">, DoctorRaw {
  periods: Period[];
  workDays: WeekDay[];
}

export type DoctorDTO = z.infer<typeof doctorInsertSchema>;
export type DoctorWithUserDTO = z.infer<typeof doctorWithUserSchema>;
