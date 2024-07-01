import { z } from "zod";
import attendancesParser from "../../../config/db/parsers/attendances-parser";

export type Attendance = z.infer<typeof attendancesParser.selectSchema>;
export type AttendanceDTO = z.infer<typeof attendancesParser.insertSchema>;
