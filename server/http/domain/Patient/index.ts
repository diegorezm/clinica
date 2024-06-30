import { z } from "zod";
import { patientParser } from "../../../config/db/parsers/patient-parser";

export type Patient = z.infer<typeof patientParser.selectSchema>;
export type PatientDTO = z.infer<typeof patientParser.insertSchema>;
