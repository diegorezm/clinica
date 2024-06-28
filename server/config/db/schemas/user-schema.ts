import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  serial,
  integer,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

export const usersSchema = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

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
