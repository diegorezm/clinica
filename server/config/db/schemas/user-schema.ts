import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { rolesSchema } from "./roles-schema";

export const usersSchema = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRolesSchema = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .references(() => usersSchema.id, { onDelete: "cascade" })
      .notNull(),
    roleId: integer("role_id")
      .references(() => rolesSchema.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roleId, table.userId] }),
    };
  },
);
