import { expect, test, describe, afterAll } from "bun:test";
import db from "../../config/db";
import { usersSchema } from "../../config/db/schemas/user-schema";
import { doctorSchema } from "../../config/db/schemas/doctor-schema";
import doctorService from "../../http/services/doctor-service";
import userService from "../../http/services/user-service";
import { DoctorAlreadyExistsException } from "../../http/domain/Doctor/exceptions/doctor-already-exists";
import { DoctorNotFoundException } from "../../http/domain/Doctor/exceptions/doctor-not-found";
import { createUserDTO, createDoctorDTO } from "../helpers";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing doctor service", () => {
  // Clean up database after all tests
  afterAll(async () => {
    await db.delete(doctorSchema).execute();
    await db.delete(usersSchema).execute();
  });

  test.if(DEV_ENV)("Create a doctor", async () => {
    const userData = createUserDTO();
    const user = await userService.register(userData);

    const doctorData = createDoctorDTO(user.id);
    const doctor = await doctorService.create(doctorData);

    expect(doctor).toBeDefined();
    expect(doctor.id).toBeDefined();
    expect(doctor.crm).toBe(doctorData.crm);
    expect(doctor.jobFunction).toBe(doctorData.jobFunction);
  });

  test.if(DEV_ENV)("Get doctor by ID", async () => {
    // Create a user first
    const userData = createUserDTO();
    const user = await userService.register(userData);

    const doctorData = createDoctorDTO(user.id);
    const doctor = await doctorService.create(doctorData);

    const fetcheddoctor = await doctorService.getById(doctor.id);

    expect(fetcheddoctor).toBeDefined();
    expect(fetcheddoctor.id).toBe(doctor.id);
    expect(fetcheddoctor.crm).toBe(doctor.crm);
    expect(fetcheddoctor.jobFunction).toBe(doctor.jobFunction);
  });

  test.if(DEV_ENV)("Get doctor by name", async () => {
    const userData = createUserDTO();
    const user = await userService.register(userData);

    const doctorData = createDoctorDTO(user.id);
    const doctor = await doctorService.create(doctorData);

    // Get the doctor by name
    const fetcheddoctor = await doctorService.getByNome(user.name);

    expect(fetcheddoctor).toBeDefined();
    expect(fetcheddoctor.id).toBe(doctor.id);
    expect(fetcheddoctor.crm).toBe(doctor.crm);
    expect(fetcheddoctor.jobFunction).toBe(doctor.jobFunction);
  });

  test.if(DEV_ENV)("Get doctor by CRM", async () => {
    const userData = createUserDTO();
    const user = await userService.register(userData);

    const doctorData = createDoctorDTO(user.id);
    const doctor = await doctorService.create(doctorData);

    const fetcheddoctor = await doctorService.getByCRM(doctor.crm);

    expect(fetcheddoctor).toBeDefined();
    expect(fetcheddoctor.id).toBe(doctor.id);
    expect(fetcheddoctor.crm).toBe(doctor.crm);
    expect(fetcheddoctor.jobFunction).toBe(doctor.jobFunction);
  });

  test.if(DEV_ENV)("Remove doctor", async () => {
    const userData = createUserDTO();
    const user = await userService.register(userData);

    const doctorData = createDoctorDTO(user.id);
    const doctor = await doctorService.create(doctorData);

    // Remove the doctor
    await doctorService.remove(doctor.id);

    let deleteddoctor;
    try {
      deleteddoctor = await doctorService.getById(doctor.id);
    } catch (error: any) {
      expect(error).toBeInstanceOf(DoctorNotFoundException);
    }
    expect(deleteddoctor).toBeUndefined();
  });

  test.if(DEV_ENV)(
    "Should not be able to insert a doctor if their crm is already in the db.",
    async () => {
      const userData = createUserDTO();
      const user = await userService.register(userData);

      const doctorData = createDoctorDTO(user.id);

      const userData2 = createUserDTO();

      const user2 = await userService.register(userData2);

      const doctorData2 = createDoctorDTO(user2.id);

      try {
        await doctorService.create(doctorData);
        await doctorService.create(doctorData2);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DoctorAlreadyExistsException);
      }
    },
  );
});
