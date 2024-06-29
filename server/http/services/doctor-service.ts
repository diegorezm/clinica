import { eq } from "drizzle-orm";
import db from "../../config/db";
import { doctorSchema } from "../../config/db/schemas/doctor-schema";
import { usersSchema } from "../../config/db/schemas/user-schema";
import { Doctor, DoctorDTO, DoctorWithUser } from "../domain/Doctor";
import { DoctorNotFoundException } from "../domain/Doctor/exceptions/doctor-not-found";
import { DoctorAlreadyExistsException } from "../domain/Doctor/exceptions/doctor-already-exists";

class DoctorService {
  async getAll(): Promise<DoctorWithUser[]> {
    const request = await db
      .select({
        id: doctorSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        crm: doctorSchema.crm,
        jobFunction: doctorSchema.jobFunction,
        createdAt: doctorSchema.createdAt,
        updatedAt: doctorSchema.updatedAt,
      })
      .from(usersSchema)
      .innerJoin(doctorSchema, eq(usersSchema.id, doctorSchema.userId))
      .orderBy(usersSchema.name);
    return request;
  }
  async getById(medicoId: number): Promise<DoctorWithUser> {
    const request = await db
      .select({
        id: doctorSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        crm: doctorSchema.crm,
        jobFunction: doctorSchema.jobFunction,
        createdAt: doctorSchema.createdAt,
        updatedAt: doctorSchema.updatedAt,
      })
      .from(usersSchema)
      .innerJoin(doctorSchema, eq(usersSchema.id, doctorSchema.userId))
      .orderBy(usersSchema.name)
      .where(eq(doctorSchema.id, medicoId))
      .limit(1);

    if (request.length === 0) {
      throw new DoctorNotFoundException();
    }
    return request[0];
  }

  async getByNome(name: string): Promise<DoctorWithUser> {
    const request = await db
      .select({
        id: doctorSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        crm: doctorSchema.crm,
        jobFunction: doctorSchema.jobFunction,
        createdAt: doctorSchema.createdAt,
        updatedAt: doctorSchema.updatedAt,
      })
      .from(usersSchema)
      .innerJoin(doctorSchema, eq(usersSchema.id, doctorSchema.userId))
      .orderBy(usersSchema.name)
      .where(eq(usersSchema.name, name))
      .limit(1);

    if (request.length === 0) {
      throw new DoctorNotFoundException();
    }
    return request[0];
  }
  async getByCRM(crm: string) {
    const request = await db
      .select({
        id: doctorSchema.id,
        name: usersSchema.name,
        email: usersSchema.email,
        crm: doctorSchema.crm,
        jobFunction: doctorSchema.jobFunction,
        createdAt: doctorSchema.createdAt,
        updatedAt: doctorSchema.updatedAt,
      })
      .from(usersSchema)
      .innerJoin(doctorSchema, eq(usersSchema.id, doctorSchema.userId))
      .orderBy(usersSchema.name)
      .where(eq(doctorSchema.crm, crm))
      .limit(1);

    if (request.length === 0) {
      throw new DoctorNotFoundException();
    }
    return request[0];
  }
  async create(payload: DoctorDTO): Promise<Doctor> {
    const medicoExists = await this.getByCRM(payload.crm).catch((e) => {
      if (e instanceof DoctorNotFoundException) {
        return null;
      }
      throw e;
    });

    if (medicoExists) {
      throw new DoctorAlreadyExistsException();
    }

    const [medico] = await db.insert(doctorSchema).values(payload).returning();
    return medico;
  }

  async update() { }

  async remove(medicoId: number) {
    const medico = await this.getById(medicoId);
    await db.delete(doctorSchema).where(eq(doctorSchema.id, medico.id));
  }
}

export default new DoctorService();
