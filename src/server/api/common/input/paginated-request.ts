import {z} from "zod";

export const paginatedRequestSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().default(1),
  size: z.coerce.number().default(10),
});

export type PaginatedRequest = z.infer<typeof paginatedRequestSchema>;
