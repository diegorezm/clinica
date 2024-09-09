"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DoctorsTable from "@/features/doctors/components/doctors-table";
import { useOpenCreateDoctor } from "@/features/doctors/hooks/use-open-create-doctor";
import { Plus } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DEBOUNCE_DELAY = 500;

type SearchProps = {
  q?: string;
  page?: string;
};

export default function DoctorsPage({
  searchParams,
}: {
  searchParams?: SearchProps;
}) {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  const [formSearchQ, setFormSearchQ] = useState(q);
  const { onOpen } = useOpenCreateDoctor();

  const pathname = usePathname();
  const { replace } = useRouter();

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

  return (
    <div className="max-w-screen-2xl w-full pb-10">
      <Card className="drop-shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle>Pacientes</CardTitle>
          <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between">
            <Input
              placeholder="Pesquise por nome/rg..."
              className="w-full md:w-1/3"
              value={formSearchQ}
              onChange={(e) => setFormSearchQ(e.target.value)}
            />
            <Button size="sm" onClick={onOpen}>
              <Plus className="size-4 mr-2" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DoctorsTable q={q} page={page} />
        </CardContent>
      </Card>
    </div>
  );
}
