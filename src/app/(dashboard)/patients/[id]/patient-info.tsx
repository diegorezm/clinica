import {Patient} from "@/models/Patient";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const CardInfo = ({field, info}: {field: string, info: string}) => {
  return (
    <p>
      <span className="font-bold">{field}: </span>
      {info}
    </p>
  )
}

export default function PatientInfo({patient}: {patient: Patient}) {
  return (
    <Card className="drop-shadow-sm w-full">
      <CardHeader className="space-y-2">
        <CardTitle>{patient.name}</CardTitle>
        <CardContent className="flex felx-col justify-between">
          <div>
            <CardInfo field={"NOME"} info={patient.name} />
            <CardInfo field={"TELEFONE"} info={patient.phone} />
          </div>
          <div>
            {patient.insurance && (
              <CardInfo field={"SEGURO"} info={patient.insurance} />
            )}
            {patient.insuranceNumber && (
              <CardInfo field={"N° SEGURO"} info={patient.insuranceNumber} />
            )}
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
