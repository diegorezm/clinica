import {
  datetime,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import crypto from "crypto";

// ENUMS
export const userRolesEnum = mysqlEnum("user_roles", [
  "admin",
  "regular",
  "doctor",
]);
export const statusEnum = mysqlEnum("status", ["f", "fj", "fm", "ok", "p"]);
export const doctorWorkPeriodEnum = mysqlEnum("periods", ["m", "t", "n"]);
export const weekDaysEnum = mysqlEnum("week_days_enum", [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

// TABLES

export const usersTable = mysqlTable("users", {
  id: varchar("id", {length: 255})
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .unique(),
  name: varchar("name", {length: 128}).notNull(),
  email: varchar("email", {length: 255}).notNull().unique(),
  role: userRolesEnum.default("regular").notNull(),
  password: varchar("password", {length: 255}).notNull(),
  createdAt: timestamp("created_at", {mode: "date", fsp: 3})
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {mode: "date", fsp: 3})
    .defaultNow()

    .notNull(),
});

export const sessionTable = mysqlTable("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => usersTable.id),
  expiresAt: datetime("expires_at").notNull(),
});

export const doctorsTable = mysqlTable("doctors", {
  id: varchar("id", {length: 255})
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .unique(),
  jobFunction: varchar("job_function", {length: 128}).notNull(),
  crm: varchar("crm", {length: 12}).notNull().unique(),
  userId: varchar("user_id", {length: 128})
    .references(() => usersTable.id, {onDelete: "cascade"})
    .unique()
    .notNull(),
  createdAt: timestamp("created_at", {mode: "date", fsp: 3})
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "date", fsp: 3})
    .defaultNow()

    .notNull(),
});

export const patientsTable = mysqlTable("patients", {
  id: varchar("id", {length: 255})
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .unique(),
  name: varchar("name", {length: 255}).notNull(),
  phone: varchar("phone", {length: 14}).notNull(),
  rg: varchar("rg", {length: 12}).unique(),
  insurance: varchar("insurance", {length: 255}),
  insuranceNumber: varchar("insuranceNumber", {length: 30}),
  createdAt: timestamp("created_at", {mode: "date", fsp: 3})
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "date", fsp: 3})
    .defaultNow()

    .notNull(),
});

export const patientReferralsTable = mysqlTable(
  "patients_referrals",
  {
    id: int("id").autoincrement().primaryKey(),
    patientId: varchar("patient_id", {length: 255})
      .references(() => patientsTable.id)
      .notNull(),
    crm: varchar("crm", {length: 12}).notNull(),
    cid: varchar("cid", {length: 12}).notNull(),
    jobFunction: varchar("job_function", {length: 128}).notNull(),
    createdAt: timestamp("created_at", {mode: "date", fsp: 3})
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {mode: "date", fsp: 3})
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      referralsIdx: index("referral_index").on(table.patientId),
    };
  },
);

export const appointmentsTable = mysqlTable(
  "appointments",
  {
    id: int("id").autoincrement().primaryKey(),
    doctorId: varchar("doctor_id", {length: 255})
      .references(() => doctorsTable.id)
      .notNull(),
    patientId: varchar("patient_id", {length: 255})
      .references(() => patientsTable.id)
      .notNull(),
    appointmentDate: timestamp("appointment_date", {
      mode: "date",
    }).notNull(),
    status: statusEnum.notNull().default("p"),
    createdAt: timestamp("created_at", {mode: "date", fsp: 3})
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {mode: "date", fsp: 3})
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    compositeIndex: index("patient_doctor_index").on(
      table.patientId,
      table.doctorId,
    ),
  }),
);

export const doctorWorkPeriodTable = mysqlTable("doctors_work_period", {
  doctorId: varchar("doctor_id", {length: 255})
    .references(() => doctorsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  period: doctorWorkPeriodEnum.notNull(),
});

export const doctorWorkDaysTable = mysqlTable("doctors_work_day", {
  doctorId: varchar("doctor_id", {length: 255})
    .references(() => doctorsTable.id, {onDelete: "cascade"})
    .notNull(),
  day: weekDaysEnum.notNull(),
});

// RELATIONS
