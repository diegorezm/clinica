import { Patient } from "@/models/Patient";

export default function PatientInfo({ patient }: { patient: Patient }) {
  return (
    <section className="flex flex-col items-center md:flex-row md:justify-evenly rounded-md gap-4">
      <div>
        <p>
          <span className="font-bold">Nome: </span>
          {patient.name}
        </p>
        <p>
          <span className="font-bold">Telefone: </span>
          {patient.phone}
        </p>
        <p>
          <span className="font-bold">RG: </span>
          {patient.rg}
        </p>
      </div>
      <div className="text-start">
        <p>
          <span className="font-bold">Convênio: </span>
          {patient.insurance}
        </p>
        <p>
          <span className="font-bold">Número do Convênio: </span>
          {patient.insuranceNumber}
        </p>
      </div>
    </section>
  );
}
