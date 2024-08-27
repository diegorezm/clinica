import { z } from "zod";

const processEnvSchema = z.object({
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
  DB_NAME: z.string().min(1, "DB_NAME is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PORT: z.coerce.number(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
});

const parsedEnv = processEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const { NODE_ENV, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } =
  parsedEnv.data;
