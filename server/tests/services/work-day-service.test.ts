import { expect, test, describe, beforeEach } from "bun:test";
import db from "../../config/db";
import { usersSchema } from "../../config/db/schemas/user-schema";
import { doctorSchema } from "../../config/db/schemas/doctor-schema";
import doctorService from "../../http/services/doctor-service";
import userService from "../../http/services/user-service";
import { DoctorDTO } from "../../http/domain/Doctor";
import { UserDTO } from "../../http/domain/User";
import { workDaysSchema } from "../../config/db/schemas/work-day-schema";
import { WorkDayDTO } from "../../http/domain/WorkDay";
import workDayService from "../../http/services/work-day-service";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing doctor service", () => {
  beforeEach(async () => {
    await db.delete(doctorSchema).execute();
    await db.delete(usersSchema).execute();
    await db.delete(workDaysSchema).execute();
  });
  test.if(DEV_ENV)("Test assign doctor to workday", async () => {
    const userData: UserDTO = {
      name: "Dr. House",
      email: "dr.house@example.com",
      password: "password123",
    };
    const user = await userService.register(userData);

    const doctorData: DoctorDTO = {
      userId: user.id,
      crm: "123456",
      jobFunction: "General Practitioner",
    };
    const doctor = await doctorService.create(doctorData);
    const workDayDTO: WorkDayDTO = {
      doctorId: doctor.id,
      day: "Sunday",
    };
    let workDay = await workDayService.assignDayToDoctor(workDayDTO);
    expect(workDay.doctorId).toBe(doctor.id);
    expect(workDay.day).toBe(workDayDTO.day);
    const workDays = await workDayService.getDoctorWorkDays(doctor.id);
    expect(workDays.length).toBe(1);
  });
  test.if(DEV_ENV)("Test remove doctor workday", async () => {
    const userData: UserDTO = {
      name: "Dr. House",
      email: "dr@example.com",
      password: "password123",
    };
    const user = await userService.register(userData);

    const doctorData: DoctorDTO = {
      userId: user.id,
      crm: "129090990",
      jobFunction: "General Practitioner",
    };
    const doctor = await doctorService.create(doctorData);
    const workDayDTO: WorkDayDTO = {
      doctorId: doctor.id,
      day: "Sunday",
    };
    let workDay = await workDayService.assignDayToDoctor(workDayDTO);
    expect(workDay.doctorId).toBe(doctor.id);
    expect(workDay.day).toBe(workDayDTO.day);

    await workDayService.removeWorkDayFromDoctor(workDayDTO);
    const workDays = await workDayService.getDoctorWorkDays(doctor.id);
    expect(workDays.length).toBe(0);
  });
});
