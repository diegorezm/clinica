"use client";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Loader2 } from "lucide-react";
import { useBulkDeleteDoctors } from "../api/use-bulk-delete-doctors";
import { useGetDoctors } from "../api/use-get-doctors";
import { doctorCols } from "./columns";

export default function PatientsTable({
  q,
  page,
}: {
  q?: string;
  page: number;
}) {
  const { data, isPlaceholderData, isPending, error } = useGetDoctors({
    q: q,
    page: page,
    size: 8,
  });

  const deleteDoctors = useBulkDeleteDoctors();

  const isDisabled = isPending || deleteDoctors.isPending;

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
        columns={doctorCols}
        data={data.data}
        disabled={isDisabled}
        onDelete={(rows) => {
          const ids: number[] = rows.map((row) => row.original.id);
          deleteDoctors.mutate(ids);
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
