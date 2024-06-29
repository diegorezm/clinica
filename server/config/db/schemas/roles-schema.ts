import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const rolesSchema = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
  permissions: text("permissions").array().$type<string[]>().notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
