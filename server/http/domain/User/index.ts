import { z } from "zod";
import userParser from "../../../config/db/parsers/user-parser";

export type User = z.infer<typeof userParser.selectSchema>;
export type UserDTO = z.infer<typeof userParser.insertSchema>;
