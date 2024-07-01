import { describe, expect, test, afterAll, beforeAll } from "bun:test";
import db from "../../config/db";
import { doctorSchema } from "../../config/db/schemas/doctor-schema";
import { patientsSchema } from "../../config/db/schemas/patient-schema";
import { attendancesSchema } from "../../config/db/schemas/attendances-schema";
import doctorService from "../../http/services/doctor-service";
import patientService from "../../http/services/patient-service";
import attendancesService from "../../http/services/attendances-service";
import userService from "../../http/services/user-service";

import {
  createUserDTO,
  createDoctorDTO,
  createPatientDTO,
  createAttendanceDTO,
} from "../helpers";
import { AttendanceNotFoundException } from "../../http/domain/Attendance/exceptions/attendence-not-found";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Test attendance service", () => {
  let doctorId: number;
  let patientId: number;

  beforeAll(async () => {
    // Create a doctor and a patient to use in the tests
    const userData = createUserDTO();
    const user = await userService.register(userData);
    const doctorData = createDoctorDTO(user.id);
    const createdDoctor = await doctorService.create(doctorData);
    doctorId = createdDoctor.id;

    const patientData = createPatientDTO();
    const createdPatient = await patientService.create(patientData);
    patientId = createdPatient.id;
  });

  afterAll(async () => {
    await db.delete(attendancesSchema).execute();
    await db.delete(doctorSchema).execute();
    await db.delete(patientsSchema).execute();
  });

  test.if(DEV_ENV)("Create an attendance", async () => {
    const attendanceData = createAttendanceDTO(doctorId, patientId);
    const attendance = await attendancesService.create(attendanceData);
    expect(attendance).toBeDefined();
    expect(attendance.doctorId).toBe(attendanceData.doctorId);
    expect(attendance.patientId).toBe(attendanceData.patientId);
    expect(attendance.appointmentDate).toBeValidDate();
    expect(attendance.status).toBe(attendanceData.status!);
  });

  test.if(DEV_ENV)("Get attendance by ID", async () => {
    const attendanceData = createAttendanceDTO(doctorId, patientId);
    const createdAttendance = await attendancesService.create(attendanceData);

    const fetchedAttendance = await attendancesService.getById(
      createdAttendance.id,
    );

    expect(fetchedAttendance).toBeDefined();
    expect(fetchedAttendance.id).toBe(createdAttendance.id);
    expect(fetchedAttendance.doctorId).toBe(createdAttendance.doctorId);
    expect(fetchedAttendance.patientId).toBe(createdAttendance.patientId);
    expect(fetchedAttendance.appointmentDate).toBeValidDate();
    expect(fetchedAttendance.status).toBe(createdAttendance.status);
  });

  test.if(DEV_ENV)("Get attendances by doctor ID", async () => {
    const attendanceData = createAttendanceDTO(doctorId, patientId);
    await attendancesService.create(attendanceData);

    const attendances = await attendancesService.getByDoctorId(doctorId);

    expect(attendances).toBeDefined();
    expect(attendances.length).toBeGreaterThan(0);
    attendances.forEach((attendance) => {
      expect(attendance.doctorId).toBe(doctorId);
    });
  });

  test.if(DEV_ENV)("Get attendances by patient ID", async () => {
    const attendanceData = createAttendanceDTO(doctorId, patientId);
    await attendancesService.create(attendanceData);

    const attendances = await attendancesService.getByPatientId(patientId);

    expect(attendances).toBeDefined();
    expect(attendances.length).toBeGreaterThan(0);
    attendances.forEach((attendance) => {
      expect(attendance.patientId).toBe(patientId);
    });
  });

  test.if(DEV_ENV)("Delete attendance", async () => {
    const attendanceData = createAttendanceDTO(doctorId, patientId);
    const createdAttendance = await attendancesService.create(attendanceData);

    await attendancesService.delete(createdAttendance.id);

    let deletedAttendance;
    try {
      deletedAttendance = await attendancesService.getById(
        createdAttendance.id,
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(AttendanceNotFoundException);
    }
    expect(deletedAttendance).toBeUndefined();
  });
});
