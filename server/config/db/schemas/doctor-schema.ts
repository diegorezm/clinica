import { pgTable, serial, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersSchema } from "./user-schema";
import { workDaysSchema } from "./work-day-schema";
import { attendancesSchema } from "./attendances-schema";

export const doctorSchema = pgTable("doctors", {
  id: serial("id").primaryKey(),
  jobFunction: varchar("job_function", { length: 128 }).notNull(),
  crm: varchar("crm", { length: 9 }).notNull().unique(),
  userId: uuid("user_id")
    .references(() => usersSchema.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const doctorRelations = relations(doctorSchema, ({ many, one }) => ({
  atendimentos: many(attendancesSchema),
  workDays: many(workDaysSchema),
  user: one(usersSchema, {
    fields: [doctorSchema.userId],
    references: [usersSchema.id],
  }),
}));
