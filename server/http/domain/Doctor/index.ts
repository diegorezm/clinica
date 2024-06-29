import { z } from "zod";
import doctorParser from "../../../config/db/parsers/doctor-parser";

export type Doctor = z.infer<typeof doctorParser.selectSchema>;
export type DoctorDTO = z.infer<typeof doctorParser.insertSchema>;
export interface DoctorWithUser {
  id: number;
  name: string;
  email: string;
  crm: string;
  jobFunction: string;
  createdAt: Date;
  updatedAt: Date;
}
