import AuthService from "@/server/api/routes/auth/services/auth.service";
import UserRepository from "@/server/api/routes/users/repositories/user.repository";
import db from ".";

const userRepository = new UserRepository(db);
const authService = new AuthService(userRepository);

(async function main() {
  try {
    // const patients = patientFactory(40);
    // await db.insert(patientsTable).values(patients);
    await authService.register({
      name: "admin",
      email: "admin@email.com",
      role: "admin",
      password: "abcabc",
    });
    console.log("Successfully seeded the database.");
  } catch (error) {
    console.error("Error seeding table:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
