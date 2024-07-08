import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { Attendance } from "../domain/Attendance";
import attendancesService from "../services/attendances-service";
export const attendanceRoute = new Hono();

const search = z
  .object({
    type: z.enum(["patientId", "doctorId", "patientAndDoctorId"]),
    doctorId: z.number().optional().nullable(),
    patientId: z.number().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "patientId" && !data.patientId) {
        return false;
      }
      if (data.type === "doctorId" && !data.doctorId) {
        return false;
      }
      if (
        data.type === "patientAndDoctorId" &&
        (!data.patientId || !data.doctorId)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Invalid search criteria",
    },
  );

attendanceRoute.get(
  "/search",
  zValidator("json", search, (res) => {
    if (!res.success) {
      throw new z.ZodError(res.error.errors);
    }
  }),
  async (c) => {
    let res: Attendance[];
    const body = c.req.valid("json");
    switch (body.type) {
      case "doctorId":
        res = await attendancesService.getByDoctorId(body.doctorId!);
        break;
      case "patientId":
        res = await attendancesService.getByPatientId(body.patientId!);
        break;
      case "patientAndDoctorId":
        res = await attendancesService.getByDoctorIdAndPatientId({
          patientId: body.patientId!,
          doctorId: body.doctorId!,
        });
        break;
    }
    return c.json(res, 200);
  },
);
