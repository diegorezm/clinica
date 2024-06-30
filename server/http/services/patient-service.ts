import { eq } from "drizzle-orm";
import db from "../../config/db";
import { patientsSchema } from "../../config/db/schemas/patient-schema";
import { Patient, PatientDTO } from "../domain/Patient";
import { PatientNotFoundException } from "../domain/Patient/exceptions/patient-not-found";

class PatientService {
  async getById(patientId: number): Promise<Patient> {
    const [p] = await db
      .select()
      .from(patientsSchema)
      .where(eq(patientsSchema.id, patientId));
    if (!p) {
      throw new PatientNotFoundException();
    }
    return p;
  }
  async getByRg(rg: string): Promise<Patient> {
    const [p] = await db
      .select()
      .from(patientsSchema)
      .where(eq(patientsSchema.rg, rg));
    if (!p) {
      throw new PatientNotFoundException();
    }
    return p;
  }
  async getByName(name: string): Promise<Patient> {
    const [p] = await db
      .select()
      .from(patientsSchema)
      .where(eq(patientsSchema.name, name));
    if (!p) {
      throw new PatientNotFoundException();
    }
    return p;
  }
  async create(payload: PatientDTO): Promise<Patient> {
    const [p] = await db.insert(patientsSchema).values(payload).returning();
    return p;
  }
  async update() {}
  async delete(patientId: number) {
    const p = await this.getById(patientId);
    await db.delete(patientsSchema).where(eq(patientsSchema.id, p.id));
  }
}
export default new PatientService();
