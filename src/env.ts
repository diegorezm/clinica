import { z, ZodError } from "zod";

const processEnvSchema = z.object({
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
  DB_NAME: z.string().min(1, "DB_NAME is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PORT: z.coerce.number(),
  HASH_KEY: z.string().min(1, "HASH_KEY is required"),
  JWT_SECRET_KEY: z.string().min(1, "HASH_KEY is required"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
});

const parsedEnv = processEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  throw new ZodError(parsedEnv.error.errors);
}

export const {
  NODE_ENV,
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  HASH_KEY,
  JWT_SECRET_KEY,
} = parsedEnv.data;
