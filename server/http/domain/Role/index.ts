import { z } from "zod";
import roleParser from "../../../config/db/parsers/role-parser";

export type Role = z.infer<typeof roleParser.selectSchema>;
export type RoleDTO = z.infer<typeof roleParser.insertSchema>;
