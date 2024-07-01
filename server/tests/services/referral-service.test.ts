import { describe, expect, test, afterAll, beforeAll } from "bun:test";
import db from "../../config/db";
import { patientsSchema } from "../../config/db/schemas/patient-schema";
import patientService from "../../http/services/patient-service";
import { PatientDTO } from "../../http/domain/Patient";
import { createPatientDTO, createReferralDTO } from "../helpers";
import { referralsSchema } from "../../config/db/schemas/referrals-schema";
import referralService from "../../http/services/referral-service";
import { ReferralNotFoundException } from "../../http/domain/Patient/exceptions/referral-not-found";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";
describe("Test referral service", () => {
  let patientId: number;

  beforeAll(async () => {
    // Create a patient to use in the tests
    const patientData: PatientDTO = createPatientDTO();
    const createdPatient = await patientService.create(patientData);
    patientId = createdPatient.id;
  });

  afterAll(async () => {
    await db.delete(referralsSchema).execute();
    await db.delete(patientsSchema).execute();
  });

  test.if(DEV_ENV)("Create a referral", async () => {
    const referralData = createReferralDTO(patientId);
    const referral = await referralService.create(referralData);

    expect(referral).toBeDefined();
    expect(referral.cid).toBe(referralData.cid);
    expect(referral.crm).toBe(referralData.crm);
    expect(referral.patientId).toBe(referralData.patientId);
    expect(referral.jobFunction).toBe(referralData.jobFunction);
  });

  test.if(DEV_ENV)("Get referral by ID", async () => {
    const referralData = createReferralDTO(patientId);
    const createdReferral = await referralService.create(referralData);

    const fetchedReferral = await referralService.getById(createdReferral.id);

    expect(fetchedReferral).toBeDefined();
    expect(fetchedReferral.id).toBe(createdReferral.id);
    expect(fetchedReferral.cid).toBe(createdReferral.cid);
    expect(fetchedReferral.crm).toBe(createdReferral.crm);
    expect(fetchedReferral.patientId).toBe(createdReferral.patientId);
    expect(fetchedReferral.jobFunction).toBe(createdReferral.jobFunction);
  });

  test.if(DEV_ENV)("Get referrals by patient ID", async () => {
    const referralData = createReferralDTO(patientId);
    await referralService.create(referralData);

    const referrals = await referralService.getByPatient(patientId);

    expect(referrals).toBeDefined();
    expect(referrals.length).toBeGreaterThan(0);
    referrals.forEach((referral) => {
      expect(referral.patientId).toBe(patientId);
    });
  });

  test.if(DEV_ENV)("Get referrals by CID", async () => {
    const referralData = createReferralDTO(patientId);
    await referralService.create(referralData);

    const referrals = await referralService.getByCid(referralData.cid);

    expect(referrals).toBeDefined();
    expect(referrals.length).toBeGreaterThan(0);
    referrals.forEach((referral) => {
      expect(referral.cid).toBe(referralData.cid);
    });
  });

  test.if(DEV_ENV)("Get referrals by CRM", async () => {
    const referralData = createReferralDTO(patientId);
    await referralService.create(referralData);

    const referrals = await referralService.getByCrm(referralData.crm);

    expect(referrals).toBeDefined();
    expect(referrals.length).toBeGreaterThan(0);
    referrals.forEach((referral) => {
      expect(referral.crm).toBe(referralData.crm);
    });
  });

  test.if(DEV_ENV)("Delete referral", async () => {
    const referralData = createReferralDTO(patientId);
    const createdReferral = await referralService.create(referralData);

    await referralService.delete(createdReferral.id);

    let deletedReferral;
    try {
      deletedReferral = await referralService.getById(createdReferral.id);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ReferralNotFoundException);
    }
    expect(deletedReferral).toBeUndefined();
  });
});
