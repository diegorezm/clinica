"use client";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Plus} from "lucide-react";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import PatientsRefarralsTable from "@/features/patients-referrals/components/patients-referral-table";
import {useGetPatient} from "@/features/patients/api/use-get-patient";
import LoadingSpinner from "@/components/loading-spinner";
import {useOpenCreatePatientReferral} from "@/features/patients-referrals/hooks/use-open-create-patient-referrals";
import {useCallback, useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import PatientInfo from "./patient-info";

const DEBOUNCE_DELAY = 500;

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    q?: string;
    page?: string;
  };
};
export default function PatientPage({params, searchParams}: Props) {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const {onOpen} = useOpenCreatePatientReferral();
  const [formSearchQ, setFormSearchQ] = useState(q);

  const getPatient = useGetPatient(params.id);
  const pathname = usePathname();
  const {replace} = useRouter();

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("q", formSearchQ);
    replace(`${pathname}?${params.toString()}`);
  }, [formSearchQ, pathname, searchParams, replace]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch();
    }, DEBOUNCE_DELAY);
    return () => {
      clearTimeout(handler);
    };
  }, [formSearchQ, handleSearch]);

  if (getPatient.isFetching) {
    return <LoadingSpinner />;
  }
  if (getPatient.isError) {
    return <p>Erro! {getPatient.error.message}</p>;
  }

  return (
    <div className="flex flex-col max-w-screen-2xl w-full h-full space-y-2">
      <PatientInfo patient={getPatient.data!} />
      <nav className="flex justify-start items-center w-full">
        <Link href={"/patients"} scroll={false}>
          <Button size="sm" variant={"ghost"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </nav>
      <Card className="drop-shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle>Encaminhamentos de {getPatient.data?.name}</CardTitle>
          <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between">
            <Input
              placeholder="Pesquise por CID/CRM..."
              className="w-full md:w-1/3"
              value={formSearchQ}
              onChange={(e) => setFormSearchQ(e.target.value)}
            />
            <Button size="sm" onClick={() => onOpen(params.id)}>
              <Plus className="size-4 mr-2" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PatientsRefarralsTable
            patientId={params.id}
            page={page}
            q={q}
          />
        </CardContent>
      </Card>
    </div>
  );
}
