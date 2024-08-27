"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PatientsRefarralsTable from "@/features/patients-referrals/components/patients-referral-table";
import { useGetPatient } from "@/features/patients/api/use-get-patient";
import LoadingSpinner from "@/components/loading-spinner";
import { useOpenCreatePatientReferral } from "@/features/patients-referrals/hooks/use-open-create-patient-referrals";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    q?: string;
    page?: string;
  };
};
export default function PatientPage({ params, searchParams }: Props) {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const { onOpen } = useOpenCreatePatientReferral();
  const [formSearchQ, setFormSearchQ] = useState(q);

  const getPatient = useGetPatient(Number(params.id));
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("q", search);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, searchParams, replace],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(formSearchQ);
  };


  useEffect(() => {
    if (formSearchQ === "") {
      handleSearch("");
    }
  }, [formSearchQ, handleSearch]);

  if (getPatient.isFetching) {
    return <LoadingSpinner />;
  }
  if (getPatient.isError) {
    return <p>Erro! {getPatient.error.message}</p>;
  }

  return (
    <div className="flex flex-col max-w-screen-2xl w-full h-full space-y-2">
      <nav className="flex justify-start items-center w-full">
        <Link href={"/patients"} scroll={false}>
          <Button size="sm">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </nav>
      <Card className="drop-shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle>Encaminhamentos de {getPatient.data?.name}</CardTitle>
          <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between">
            <form className="flex gap-1 w-full" onSubmit={onSubmit}>
              <Input
                placeholder="Pesquise por CID/CRM..."
                className="w-full md:w-1/3"
                value={formSearchQ}
                onChange={(e) => setFormSearchQ(e.target.value)}
              />
              <Button
                size="sm"
                type={"submit"}
                className="hidden md:inline-flex"
              >
                <Search className="size-4" />
              </Button>
            </form>
            <Button size="sm" onClick={() => onOpen(Number(params.id))}>
              <Plus className="size-4 mr-2" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PatientsRefarralsTable
            patientId={Number(params.id)}
            page={page}
            q={q}
          />
        </CardContent>
      </Card>
    </div>
  );
}

