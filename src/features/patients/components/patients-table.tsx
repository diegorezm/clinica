"use client";
import { DataTable } from "@/components/data-table";
import { useGetPatients } from "../api/use-get-patients";
import { patientCols } from "./columns";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Loader2 } from "lucide-react";
import { useBulkDeletePatients } from "../api/use-bulk-delete-patients";

export default function PatientsTable({
  q,
  page,
}: {
  q?: string;
  page: number;
}) {
  const { data, isPlaceholderData, isPending, error } = useGetPatients({
    q: q,
    page: page,
    size: 8,
  });

  const deletePatients = useBulkDeletePatients();

  const isDisabled = isPending || deletePatients.isPending;

  if (error) return <div>Error! {error.message}</div>;

  if (isPlaceholderData || isPending)
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        columns={patientCols}
        data={data.data}
        disabled={isDisabled}
        onDelete={(rows) => {
          const ids: number[] = rows.map((row) => row.original.id);
          deletePatients.mutate({ ids });
        }}
      />
      <DataTablePagination
        page={page}
        numberOfPages={data.numberOfPages}
        hasNextPage={data.hasNextPage}
      />
    </div>
  );
}
