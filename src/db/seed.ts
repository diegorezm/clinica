import { patientFactory } from "@/factory/patients-factory";
import db from ".";
import { patientsTable } from "./schema";

(async function main() {
  try {
    const patients = patientFactory(40);
    await db.insert(patientsTable).values(patients);
    console.log("Successfully seeded the database.");
  } catch (error) {
    console.error("Error seeding patients table:", error);

    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
