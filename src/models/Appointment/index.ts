import {z} from "zod";
import {appointmentsTable} from "@/db/schema";
import {createInsertSchema} from "drizzle-zod";

export enum Status {
  Pending = "p",
  Finished = "f",
  FinalJudgment = "fj",
  FinalMaintenance = "fm",
  Okay = "ok",
}

export const appointmentInsertSchema = createInsertSchema(
  appointmentsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Appointment = typeof appointmentsTable.$inferSelect;
export type AppointmentDTO = z.infer<typeof appointmentInsertSchema>;
export interface AppointmentWithInfo extends Appointment {
  doctorName: string | null;
  doctorFn: string | null;
  patientName: string | null;
  patientRg: string | null;
};
