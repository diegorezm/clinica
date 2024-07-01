import { describe, expect, test, afterAll } from "bun:test";
import db from "../../config/db";
import { patientsSchema } from "../../config/db/schemas/patient-schema";
import patientService from "../../http/services/patient-service";
import { PatientDTO } from "../../http/domain/Patient";
import { PatientNotFoundException } from "../../http/domain/Patient/exceptions/patient-not-found";
import { createPatientDTO } from "./test-helpers"; // Import the helper function

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing patient service", () => {
  afterAll(async () => {
    await db.delete(patientsSchema).execute();
  });

  test.if(DEV_ENV)("Create a patient", async () => {
    const patientData: PatientDTO = createPatientDTO(); // Use helper function to create patient data

    const createdPatient = await patientService.create(patientData);

    expect(createdPatient).toBeDefined();
    expect(createdPatient.name).toBe(patientData.name);
    expect(createdPatient.phone).toBe(patientData.phone);
    expect(createdPatient.rg).toBe(patientData.rg!);
    expect(createdPatient.insurance).toBe(patientData.insurance!);
    expect(createdPatient.insuranceNumber).toBe(patientData.insuranceNumber!);
  });

  test.if(DEV_ENV)("Get patient by ID", async () => {
    const patientData: PatientDTO = createPatientDTO(); // Use helper function to create patient data

    const createdPatient = await patientService.create(patientData);

    const fetchedPatient = await patientService.getById(createdPatient.id);

    expect(fetchedPatient).toBeDefined();
    expect(fetchedPatient.id).toBe(createdPatient.id);
    expect(fetchedPatient.name).toBe(createdPatient.name);
    expect(fetchedPatient.phone).toBe(createdPatient.phone);
    expect(fetchedPatient.rg).toBe(createdPatient.rg);
    expect(fetchedPatient.insurance).toBe(createdPatient.insurance);
    expect(fetchedPatient.insuranceNumber).toBe(createdPatient.insuranceNumber);
  });

  test.if(DEV_ENV)("Get patient by RG", async () => {
    const patientData: PatientDTO = createPatientDTO(); // Use helper function to create patient data

    const createdPatient = await patientService.create(patientData);

    const fetchedPatient = await patientService.getByRg(createdPatient.rg!);

    expect(fetchedPatient).toBeDefined();
    expect(fetchedPatient.id).toBe(createdPatient.id);
    expect(fetchedPatient.name).toBe(createdPatient.name);
    expect(fetchedPatient.phone).toBe(createdPatient.phone);
    expect(fetchedPatient.rg).toBe(createdPatient.rg);
    expect(fetchedPatient.insurance).toBe(createdPatient.insurance);
    expect(fetchedPatient.insuranceNumber).toBe(createdPatient.insuranceNumber);
  });

  test.if(DEV_ENV)("Delete patient", async () => {
    const patientData: PatientDTO = createPatientDTO(); // Use helper function to create patient data

    const createdPatient = await patientService.create(patientData);

    await patientService.delete(createdPatient.id);

    // Attempt to fetch the patient to ensure it's deleted
    let deletedPatient;
    try {
      deletedPatient = await patientService.getById(createdPatient.id);
    } catch (error: any) {
      expect(error).toBeInstanceOf(PatientNotFoundException);
    }
    expect(deletedPatient).toBeUndefined();
  });
});
