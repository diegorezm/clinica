import { router, adminProcedure } from "@/server/trpc";
import { z } from "zod";
import userService from "./services/users.service";
import { userInsertSchema } from "@/models/User";

const route = router({
  getById: adminProcedure.input(z.string().uuid()).query(async ({ input }) => {
    const user = await userService.getById(input);
    return user;
  }),
  update: adminProcedure
    .input(
      z.object({
        data: userInsertSchema.pick({
          name: true,
          role: true,
          email: true,
        }),
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await userService.update(input.data, input.id);
      return user;
    }),
});

export default route;
