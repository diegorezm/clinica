import { describe, expect, test, afterAll } from "bun:test";
import db from "../../config/db";
import { patientsSchema } from "../../config/db/schemas/patient-schema";
import patientService from "../../http/services/patient-service";
import { PatientDTO } from "../../http/domain/Patient";
import { PatientNotFoundException } from "../../http/domain/Patient/exceptions/patient-not-found";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing patient service", () => {
  afterAll(async () => {
    await db.delete(patientsSchema).execute();
  });

  test.if(DEV_ENV)("Create a patient", async () => {
    const patientData: PatientDTO = {
      name: "John Doe",
      phone: "(123) 456-7890",
      rg: "1234567890",
      insurance: "Health Insurance A",
      insuranceNumber: "987654321",
    };

    const createdPatient = await patientService.create(patientData);

    expect(createdPatient).toBeDefined();
    expect(createdPatient.name).toBe(patientData.name);
    expect(createdPatient.phone).toBe(patientData.phone);
    expect(createdPatient.rg).toBe(patientData.rg!);
    expect(createdPatient.insurance).toBe(patientData.insurance!);
    expect(createdPatient.insuranceNumber).toBe(patientData.insuranceNumber!);
  });

  test.if(DEV_ENV)("Get patient by ID", async () => {
    const patientData: PatientDTO = {
      name: "Jane Smith",
      phone: "(456) 789-0123",
      rg: "0987654321",
      insurance: "Health Insurance B",
      insuranceNumber: "123456789",
    };

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
    const patientData: PatientDTO = {
      name: "Bob Johnson",
      phone: "(789) 012-3456",
      rg: "1357924680",
      insurance: "Health Insurance C",
      insuranceNumber: "246801357",
    };

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
    const patientData: PatientDTO = {
      name: "Alice Williams",
      phone: "(234) 567-8901",
      rg: "8765432109",
      insurance: "Health Insurance D",
      insuranceNumber: "9876543210",
    };

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
