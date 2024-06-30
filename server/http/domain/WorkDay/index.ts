import { z } from "zod";
import workdayParser from "../../../config/db/parsers/workday-parser";

export type WorkDay = z.infer<typeof workdayParser.selectSchema>;
export type WorkDayDTO = z.infer<typeof workdayParser.insertSchema>;
export enum WeekDays {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}
