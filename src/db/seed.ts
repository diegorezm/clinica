import "reflect-metadata"
import {getInjections} from "@/server/api/common/di/container";

(async function main() {
  try {
    const authService = getInjections("IAuthService");
    await authService.register({
      name: "admin",
      email: "admin@admin.com",
      password: "admin",
      role: "admin"
    })
    await authService.register({
      name: "user",
      email: "user@clinica.com",
      password: "123456",
      role: "regular"
    })
    console.log("Successfully seeded the database.");
  } catch (error) {
    console.error("Error seeding table:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
