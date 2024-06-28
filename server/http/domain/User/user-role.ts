import { z } from "zod";
import { userRoleParser } from "../../../config/db/parsers/user-parser";
import { User } from ".";

export type UserRole = z.infer<typeof userRoleParser.selectSchema>;

export interface UserWithRole extends User {
  role: string | null;
}
