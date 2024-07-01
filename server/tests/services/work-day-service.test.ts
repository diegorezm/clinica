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
import { createDoctorDTO, createUserDTO, createWorkDayDTO } from "../helpers";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

describe("Testing doctor service", () => {
  beforeEach(async () => {
    await db.delete(doctorSchema).execute();
    await db.delete(usersSchema).execute();
    await db.delete(workDaysSchema).execute();
  });

  test.if(DEV_ENV)("Test assign doctor to workday", async () => {
    const userData: UserDTO = createUserDTO();
    const user = await userService.register(userData);

    const doctorData: DoctorDTO = createDoctorDTO(user.id);
    const doctor = await doctorService.create(doctorData);

    const workDayDTO: WorkDayDTO = createWorkDayDTO(doctor.id);
    let workDay = await workDayService.assignDayToDoctor(workDayDTO);

    expect(workDay.doctorId).toBe(doctor.id);
    expect(workDay.day).toBe(workDayDTO.day);

    const workDays = await workDayService.getDoctorWorkDays(doctor.id);
    expect(workDays.length).toBe(1);
  });

  test.if(DEV_ENV)("Test remove doctor workday", async () => {
    const userData: UserDTO = createUserDTO();
    const user = await userService.register(userData);

    const doctorData: DoctorDTO = createDoctorDTO(user.id);
    const doctor = await doctorService.create(doctorData);

    const workDayDTO: WorkDayDTO = createWorkDayDTO(doctor.id);
    let workDay = await workDayService.assignDayToDoctor(workDayDTO);

    expect(workDay.doctorId).toBe(doctor.id);
    expect(workDay.day).toBe(workDayDTO.day);

    await workDayService.removeWorkDayFromDoctor({
      doctorId: doctor.id,
      day: workDayDTO.day,
    });

    const workDays = await workDayService.getDoctorWorkDays(doctor.id);
    expect(workDays.length).toBe(0);
  });
});
