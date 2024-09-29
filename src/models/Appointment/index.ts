import {appointmentsTable} from "@/db/schema";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";

export const appointmentInsertSchema = createInsertSchema(
  appointmentsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Appointment = typeof appointmentsTable.$inferSelect;
export type AppointmentDTO = z.infer<typeof appointmentInsertSchema>;
